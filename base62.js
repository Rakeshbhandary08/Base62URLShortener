
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function toBase62(num){
    if(num===0) return "0";

    let result="";
    while(num > 0){
        result = ALPHABET[num%62] + result //front me add karte rahenge
        num=Math.floor(num/62)
    }

    return result;
}

module.exports=toBase62;