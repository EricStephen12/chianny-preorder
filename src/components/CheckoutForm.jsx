import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, CreditCard, Upload, CheckCircle, ArrowRight, ChevronLeft, MessageSquare, Phone, Loader2 } from 'lucide-react';

const CheckoutForm = () => {
    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        price: '1000',
        quantity: 1,
        proof: null,
        imageUrl: ''
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({ ...prev, proof: file }));
        setIsUploading(true);

        // --- CLOUDINARY CONFIGURATION ---
        const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        // --------------------------------

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: data,
            });
            const result = await response.json();

            if (result.secure_url) {
                setFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
                setTimeout(nextStep, 1000);
            } else {
                console.error("Upload failed:", result);
                alert("Upload failed. Please check your Cloudinary settings.");
            }
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            alert("Error connecting to Cloudinary.");
        } finally {
            setIsUploading(false);
        }
    };

    const openWhatsApp = () => {
        const BUSINESS_PHONE = import.meta.env.VITE_BUSINESS_PHONE;
        const message = `Hello Chianny! 🥨\n\nI am ${formData.name} (${formData.phone}).\nI've just placed an order for ${formData.quantity} pack(s) of Chianny Chin Chin (N${formData.price} each).\n\n📄 View Payment Receipt: ${formData.imageUrl}\n\nPlease confirm my order! 🥂`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`, '_blank');
    };

    const variants = {
        enter: { opacity: 0, y: 10 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    return (
        <div className="editorial-layout">
            <div className="editorial-image-side"></div>

            <div className="form-side">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={variants}
                            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                        >
                            <h1 className="title">Chianny Chin Chin</h1>
                            <p className="subtitle">The homemade golden crunch of perfection</p>

                            <div className="input-group">
                                <label className="input-label">Connoisseur Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input-field"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Contact Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="input-field"
                                    placeholder="+234..."
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Pack Selection</label>
                                <select
                                    name="price"
                                    className="input-field"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                >
                                    <option value="1000">N1,000</option>
                                    <option value="2500">N2,500</option>
                                    <option value="3500">N3,500</option>
                                    <option value="7500">N7,500</option>
                                    <option value="15000">N15,000</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Selection Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    className="input-field"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <button
                                className="btn-primary"
                                onClick={nextStep}
                                disabled={!formData.name || !formData.phone}
                                style={{ opacity: (formData.name && formData.phone) ? 1 : 0.5 }}
                            >
                                Advance to Order
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={variants}
                            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                        >
                            <button onClick={prevStep} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                <ChevronLeft size={14} /> Previous
                            </button>
                            <h1 className="title">The Exchange</h1>
                            <p className="subtitle">Acquiring Excellence</p>

                            <div className="payment-card">
                                <div className="account-info">
                                    <span>Bank Institution</span>
                                    <strong>OPAY</strong>

                                    <span>Account Reference</span>
                                    <strong>8138918620</strong>

                                    <span>Beneficiary</span>
                                    <strong>ANNETTE STEPHEN</strong>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Document Transfer</label>
                                <label className={`upload-area ${isUploading ? 'uploading' : ''}`}>
                                    <input type="file" hidden onChange={handleFileUpload} accept="image/*" disabled={isUploading} />
                                    {isUploading ? (
                                        <>
                                            <Loader2 size={24} color="var(--primary)" className="animate-spin" style={{ marginBottom: '1rem', margin: '0 auto' }} />
                                            <p style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Uploading Receipt...</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                                {formData.proof ? formData.proof.name : 'Upload Payment Receipt'}
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                            style={{ textAlign: 'center' }}
                        >
                            <div className="success-icon">
                                <CheckCircle size={48} />
                            </div>
                            <h1 className="title">Confirmed</h1>
                            <p className="subtitle">Welcome to the Inner Circle</p>
                            <p style={{ fontSize: '1.1rem', color: 'white', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '2.5rem' }}>
                                Dear {formData.name}, your Chianny Chin Chin is being prepared. Excellence takes time, but your wait is nearly over.
                            </p>

                            <button
                                className="btn-primary"
                                onClick={openWhatsApp}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
                            >
                                <MessageSquare size={18} /> Notify Chianny
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CheckoutForm;
