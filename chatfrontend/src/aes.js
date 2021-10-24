const aes256 = require('aes256');
const secret_key = 'uI2ooxtwHeI6q69PS98fx9SWVGbpQohO';

export const to_encrypt = (text)=>{
    const encrypted = aes256.encrypt(secret_key, text);
    return encrypted;
}

export const to_decrypt = (cypher, username)=>{
    if(cypher.startsWith('Welcome'))
        return cypher;
    if(cypher.startsWith(username)){
        return cypher;
    }
    const decrypted = aes256.decrypt(secret_key, cypher);
    return decrypted;
}