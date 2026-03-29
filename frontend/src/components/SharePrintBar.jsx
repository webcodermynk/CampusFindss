import React, { useState } from 'react';

/**
 * Reusable Share & Print bar for item detail views.
 * Props:
 *   item   — the item object (has .title, .type, .location, ._id, etc.)
 *   label  — e.g. "Lost" or "Found"
 */
const SharePrintBar = ({ item, label = 'Item' }) => {
    const [copied, setCopied] = useState(false);

    const getShareText = () => {
        const type  = item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND';
        const date  = item.dateLost || item.dateFound || '';
        const dateStr = date ? new Date(date).toLocaleDateString() : '';
        return (
            `${type} on CampusFinds\n\n` +
            `📦 ${item.title}\n` +
            `📍 ${item.location || 'Unknown location'}\n` +
            (dateStr ? `📅 ${dateStr}\n` : '') +
            `\n${item.description || ''}\n\n` +
            `🔗 View on CampusFinds`
        );
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getShareText());
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for older browsers
            const el = document.createElement('textarea');
            el.value = getShareText();
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(getShareText());
        window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener');
    };

    const handlePrint = () => window.print();

    return (
        <div className="share-print-bar">
            <button className="share-btn share-btn-copy" onClick={handleCopyLink}>
                {copied ? '✅' : '📋'} {copied ? 'Copied!' : 'Copy Details'}
            </button>
            <button className="share-btn share-btn-whatsapp" onClick={handleWhatsApp}>
                💬 Share on WhatsApp
            </button>
            <button className="share-btn share-btn-print" onClick={handlePrint}>
                🖨️ Print
            </button>
        </div>
    );
};

export default SharePrintBar;
