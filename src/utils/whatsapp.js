let sock = null;
export const setSock = (newSock) => {
    sock = newSock
};

export const getSock = () => {
    if(!sock){
        throw new Error('Whatsapp client is not initialized');
    }
    
    return sock;
}
