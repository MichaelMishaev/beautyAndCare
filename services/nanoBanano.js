/**
 * Nano Banano Cryptocurrency Payment Integration
 * Enables fast, feeless cryptocurrency payments for Davidov Beauty Care equipment
 */

class NanoBananoPayment {
    constructor() {
        // Nano/Banano network configuration
        this.networks = {
            nano: {
                rpcUrl: 'https://proxy.nanos.cc/proxy',
                wsUrl: 'wss://ws.nanos.cc',
                representative: 'nano_3arg3asgtigae3xckabaaewkx3bzsh7nwz7jkmjos79ihyaxwphhm6qgjps4',
                prefix: 'nano_'
            },
            banano: {
                rpcUrl: 'https://kaliumapi.appditto.com/api',
                wsUrl: 'wss://ws.banano.cc',
                representative: 'ban_1bananobh5rat99qfgt1ptpieie5swmoth87thi74qgbfrij7dcgjiij94xr',
                prefix: 'ban_'
            }
        };

        // Current network (default to Nano)
        this.currentNetwork = 'nano';
        
        // Exchange rates cache
        this.exchangeRates = {
            nano: { ILS: 0, USD: 0, lastUpdate: null },
            banano: { ILS: 0, USD: 0, lastUpdate: null }
        };

        // Payment configuration for Davidov Beauty Care
        this.paymentConfig = {
            merchantName: 'Davidov Beauty Care',
            merchantAddress: null, // Will be set on init
            confirmationThreshold: 1, // Number of confirmations required
            paymentTimeout: 600000, // 10 minutes in milliseconds
            currencies: ['ILS', 'USD', 'NANO', 'BAN']
        };

        // Active payment sessions
        this.activeSessions = new Map();
    }

    /**
     * Initialize payment system
     */
    async init(network = 'nano', merchantAddress = null) {
        this.currentNetwork = network;
        
        // Set merchant address or generate new one
        if (merchantAddress) {
            this.paymentConfig.merchantAddress = merchantAddress;
        } else {
            this.paymentConfig.merchantAddress = await this.generateAddress();
        }

        // Update exchange rates
        await this.updateExchangeRates();

        // Initialize WebSocket for real-time payments
        this.initWebSocket();

        console.log('Nano/Banano Payment System initialized');
        console.log('Merchant Address:', this.paymentConfig.merchantAddress);
        
        return this.paymentConfig.merchantAddress;
    }

    /**
     * Generate new payment address
     */
    async generateAddress() {
        // For production, use proper key generation
        // This is a placeholder for demonstration
        const timestamp = Date.now();
        const prefix = this.networks[this.currentNetwork].prefix;
        return `${prefix}davidov_beauty_${timestamp}_demo`;
    }

    /**
     * Update exchange rates from API
     */
    async updateExchangeRates() {
        try {
            // Fetch Nano price
            const nanoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=usd,ils');
            const nanoData = await nanoResponse.json();
            
            if (nanoData.nano) {
                this.exchangeRates.nano = {
                    ILS: nanoData.nano.ils || 0,
                    USD: nanoData.nano.usd || 0,
                    lastUpdate: new Date().toISOString()
                };
            }

            // Fetch Banano price
            const bananoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=banano&vs_currencies=usd,ils');
            const bananoData = await bananoResponse.json();
            
            if (bananoData.banano) {
                this.exchangeRates.banano = {
                    ILS: bananoData.banano.ils || 0,
                    USD: bananoData.banano.usd || 0,
                    lastUpdate: new Date().toISOString()
                };
            }

            console.log('Exchange rates updated:', this.exchangeRates);
        } catch (error) {
            console.error('Failed to update exchange rates:', error);
        }
    }

    /**
     * Convert fiat amount to crypto
     */
    convertToCrypto(amountFiat, fiatCurrency = 'ILS', cryptoCurrency = 'nano') {
        const rate = this.exchangeRates[cryptoCurrency][fiatCurrency];
        if (!rate || rate === 0) {
            throw new Error('Exchange rate not available');
        }
        
        const cryptoAmount = amountFiat / rate;
        return {
            amount: cryptoAmount.toFixed(6),
            currency: cryptoCurrency.toUpperCase(),
            fiatAmount: amountFiat,
            fiatCurrency: fiatCurrency,
            rate: rate,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Create payment request for equipment purchase
     */
    async createPaymentRequest(equipmentData) {
        const sessionId = this.generateSessionId();
        
        // Convert ILS price to crypto
        const nanoAmount = this.convertToCrypto(equipmentData.price, 'ILS', 'nano');
        const bananoAmount = this.convertToCrypto(equipmentData.price, 'ILS', 'banano');

        const paymentRequest = {
            sessionId: sessionId,
            equipment: {
                name: equipmentData.name,
                model: equipmentData.model,
                price: equipmentData.price,
                currency: 'ILS'
            },
            paymentOptions: {
                nano: {
                    amount: nanoAmount.amount,
                    address: this.paymentConfig.merchantAddress,
                    qrCode: await this.generateQRCode('nano', nanoAmount.amount)
                },
                banano: {
                    amount: bananoAmount.amount,
                    address: this.paymentConfig.merchantAddress.replace('nano_', 'ban_'),
                    qrCode: await this.generateQRCode('banano', bananoAmount.amount)
                }
            },
            status: 'pending',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.paymentConfig.paymentTimeout).toISOString()
        };

        // Store session
        this.activeSessions.set(sessionId, paymentRequest);

        // Set timeout to expire payment
        setTimeout(() => {
            this.expirePayment(sessionId);
        }, this.paymentConfig.paymentTimeout);

        return paymentRequest;
    }

    /**
     * Generate QR code for payment
     */
    async generateQRCode(currency, amount) {
        const address = currency === 'nano' 
            ? this.paymentConfig.merchantAddress 
            : this.paymentConfig.merchantAddress.replace('nano_', 'ban_');
        
        const paymentUri = `${currency}:${address}?amount=${amount}`;
        
        // For production, use proper QR code library
        // This returns a data URI placeholder
        return `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                <rect width="200" height="200" fill="white"/>
                <text x="100" y="100" text-anchor="middle" font-size="12">
                    ${currency.toUpperCase()} Payment QR
                </text>
                <text x="100" y="120" text-anchor="middle" font-size="10">
                    ${amount} ${currency.toUpperCase()}
                </text>
            </svg>
        `)}`;
    }

    /**
     * Initialize WebSocket for real-time payment monitoring
     */
    initWebSocket() {
        // Disable WebSocket in development/demo mode to prevent connection errors
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
            console.log('WebSocket disabled in local development mode');
            return;
        }
        
        const wsUrl = this.networks[this.currentNetwork].wsUrl;
        
        try {
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('WebSocket connected for payment monitoring');
                this.reconnectAttempts = 0;
                
                // Subscribe to account notifications
                if (this.paymentConfig.merchantAddress) {
                    this.ws.send(JSON.stringify({
                        action: 'subscribe',
                        topic: 'confirmation',
                        options: {
                            accounts: [this.paymentConfig.merchantAddress]
                        }
                    }));
                }
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handlePaymentUpdate(data);
            };

            this.ws.onerror = (error) => {
                console.warn('WebSocket connection failed - running in offline mode');
            };

            this.ws.onclose = () => {
                if (this.reconnectAttempts < 3) {
                    this.reconnectAttempts = (this.reconnectAttempts || 0) + 1;
                    console.log(`WebSocket reconnection attempt ${this.reconnectAttempts}/3`);
                    setTimeout(() => this.initWebSocket(), 10000);
                } else {
                    console.log('WebSocket max reconnection attempts reached - running in offline mode');
                }
            };
        } catch (error) {
            console.log('WebSocket not available - running in offline mode');
        }
    }

    /**
     * Handle incoming payment notifications
     */
    handlePaymentUpdate(data) {
        if (data.topic === 'confirmation') {
            const { amount, hash, account } = data.message;
            
            // Find matching payment session
            for (const [sessionId, session] of this.activeSessions) {
                const expectedAmount = this.currentNetwork === 'nano' 
                    ? session.paymentOptions.nano.amount 
                    : session.paymentOptions.banano.amount;
                
                // Check if amount matches (with small tolerance for rounding)
                if (Math.abs(parseFloat(amount) - parseFloat(expectedAmount)) < 0.000001) {
                    this.confirmPayment(sessionId, hash, amount);
                    break;
                }
            }
        }
    }

    /**
     * Confirm payment received
     */
    confirmPayment(sessionId, transactionHash, amount) {
        const session = this.activeSessions.get(sessionId);
        
        if (!session) {
            console.error('Session not found:', sessionId);
            return;
        }

        session.status = 'confirmed';
        session.transactionHash = transactionHash;
        session.confirmedAmount = amount;
        session.confirmedAt = new Date().toISOString();

        console.log('Payment confirmed!', session);

        // Trigger success callback
        this.onPaymentSuccess(session);

        // Clean up session after confirmation
        setTimeout(() => {
            this.activeSessions.delete(sessionId);
        }, 60000); // Keep for 1 minute for reference
    }

    /**
     * Handle successful payment
     */
    onPaymentSuccess(session) {
        // Display success message
        const successMessage = `
            Payment Received Successfully!
            Equipment: ${session.equipment.name}
            Amount: ${session.confirmedAmount} ${this.currentNetwork.toUpperCase()}
            Transaction: ${session.transactionHash}
        `;
        
        console.log(successMessage);
        
        // Trigger UI update
        if (window.paymentSuccessCallback) {
            window.paymentSuccessCallback(session);
        }

        // Send confirmation to backend
        this.sendPaymentConfirmation(session);
    }

    /**
     * Send payment confirmation to backend
     */
    async sendPaymentConfirmation(session) {
        try {
            const response = await fetch('/api/payments/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: session.sessionId,
                    transactionHash: session.transactionHash,
                    amount: session.confirmedAmount,
                    currency: this.currentNetwork,
                    equipment: session.equipment
                })
            });

            if (response.ok) {
                console.log('Payment confirmation sent to backend');
            }
        } catch (error) {
            console.error('Failed to send confirmation:', error);
        }
    }

    /**
     * Expire payment session
     */
    expirePayment(sessionId) {
        const session = this.activeSessions.get(sessionId);
        
        if (session && session.status === 'pending') {
            session.status = 'expired';
            console.log('Payment expired:', sessionId);
            
            // Clean up
            this.activeSessions.delete(sessionId);
            
            // Trigger expiry callback
            if (window.paymentExpiredCallback) {
                window.paymentExpiredCallback(session);
            }
        }
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Create payment button UI component
     */
    createPaymentButton(equipmentData, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const button = document.createElement('button');
        button.className = 'nano-payment-btn';
        button.innerHTML = `
            <span class="crypto-icon">₦</span>
            Pay with Nano/Banano
        `;

        button.onclick = async () => {
            const paymentRequest = await this.createPaymentRequest(equipmentData);
            this.showPaymentModal(paymentRequest);
        };

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .nano-payment-btn {
                background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .nano-payment-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(74, 144, 226, 0.3);
            }
            
            .crypto-icon {
                font-size: 20px;
            }
        `;
        
        document.head.appendChild(style);
        container.appendChild(button);
    }

    /**
     * Show payment modal
     */
    showPaymentModal(paymentRequest) {
        // Create modal HTML
        const modal = document.createElement('div');
        modal.className = 'nano-payment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Complete Your Payment</h2>
                <div class="equipment-info">
                    <h3>${paymentRequest.equipment.name}</h3>
                    <p class="price">₪${paymentRequest.equipment.price.toLocaleString()}</p>
                </div>
                
                <div class="payment-tabs">
                    <button class="tab-btn active" data-currency="nano">Pay with Nano</button>
                    <button class="tab-btn" data-currency="banano">Pay with Banano</button>
                </div>
                
                <div class="payment-details" id="nano-payment">
                    <img src="${paymentRequest.paymentOptions.nano.qrCode}" alt="Nano QR Code">
                    <p class="amount">${paymentRequest.paymentOptions.nano.amount} NANO</p>
                    <p class="address">${paymentRequest.paymentOptions.nano.address}</p>
                </div>
                
                <div class="payment-details" id="banano-payment" style="display:none;">
                    <img src="${paymentRequest.paymentOptions.banano.qrCode}" alt="Banano QR Code">
                    <p class="amount">${paymentRequest.paymentOptions.banano.amount} BAN</p>
                    <p class="address">${paymentRequest.paymentOptions.banano.address}</p>
                </div>
                
                <div class="payment-status">
                    <p>Waiting for payment...</p>
                    <div class="spinner"></div>
                </div>
                
                <button class="close-btn" onclick="this.closest('.nano-payment-modal').remove()">Cancel</button>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .nano-payment-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .modal-content {
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                text-align: center;
            }
            
            .payment-tabs {
                display: flex;
                gap: 8px;
                margin: 24px 0;
            }
            
            .tab-btn {
                flex: 1;
                padding: 12px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .tab-btn.active {
                background: #4A90E2;
                color: white;
                border-color: #4A90E2;
            }
            
            .payment-details img {
                width: 200px;
                height: 200px;
                margin: 16px auto;
            }
            
            .amount {
                font-size: 24px;
                font-weight: bold;
                color: #4A90E2;
                margin: 16px 0;
            }
            
            .address {
                font-family: monospace;
                font-size: 12px;
                word-break: break-all;
                padding: 12px;
                background: #f5f5f5;
                border-radius: 8px;
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4A90E2;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 16px auto;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Handle tab switching
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                modal.querySelectorAll('.payment-details').forEach(d => d.style.display = 'none');
                
                e.target.classList.add('active');
                const currency = e.target.dataset.currency;
                modal.querySelector(`#${currency}-payment`).style.display = 'block';
            });
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NanoBananoPayment;
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.nanoBananoPayment = new NanoBananoPayment();
        // Initialize with default settings
        // window.nanoBananoPayment.init('nano');
    });
}