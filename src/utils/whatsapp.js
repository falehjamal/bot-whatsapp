let sock = null;
export const setSock = (newSock) => {
    sock = newSock
};

export const getSock = () => {
    if (!sock) {
        console.log('Whatsapp client is not initialized. Please initialize before using.');
        return null;
    }
    
    return sock;
}

export const disconnectSock = async () => {
    if (sock && sock.ws) {
        try {
            await sock.logout();
            sock = null;
            console.log('WhatsApp client disconnected.');
        } catch (err) {
            console.error('Error disconnecting WhatsApp client:', err);
        }
    }
};
