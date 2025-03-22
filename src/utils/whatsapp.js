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
