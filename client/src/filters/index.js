var colors = ['FFC6A5', 'FF9473', 'FF6342', 'FF3118', 'FF0000', 'D60000', 'AD0000', '840000', '630000', 'FFE7C6', 'FFCE9C', 'FFB573', 'D66321', 'AD4A18', '844D18', '632910', 'FFFFC6', 'FFFF9C', 'FFFF6B', 'FFFF42', 'FFFF10', 'D6C610', 'AD9410', '847308', '635208', 'F7FFCE', 'EFEFAD', 'E7F784', 'DEF763', 'D6EF39', 'B5BD31', '8C9429', '6B6B21', '524818', 'C6EF83', 'ADDE63', '94D639', '7BC618', '639C18', '527B10', '425A10', '314208', 'CEEFBD', 'A5DE94', '7BC66B', '52B552', '299C39', '218429', '186321', '184A18', '103910', 'C6E7DE', '94D6CE', '63BDB5', '31ADA5', '089494', '087B7B', '006363', '004A4A', '003139', 'C6EFF7', '94D6E7', '63C6DE', '31B5D6', '00A5C6', '0084A5', '006B84', '005263', '00394A', 'BDC6DE', '949CCE', '6373B5', '3152A5', '083194', '082984', '08296B', '08215A', '00184A', 'C6B5DE', '9C7BBD', '7B52A5', '522994', '31007B', '29006B', '21005A', '21004A', '180042', 'DEBDDE', 'CE84C6', 'B552AD', '9C2994', '8C007B', '730063', '5A0052', '4A0042', '390031', 'F7BDDE', 'E78CC6', 'DE5AAD', 'D63194', 'CE007B', 'A50063', '840052', '6B0042', '520031', 'FFFFFF', 'E0E0E0', 'BFBFBF', 'A1A1A1', '808080', '616161', '000000'];

export function textToColor(text) {
    var hash = 0;
    for(var i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + hash;
    }

    return '#' + colors[hash % colors.length];
}

export function colorLightness(color) {
    var red = parseInt(color.substr(1, 2), 16);
    var green = parseInt(color.substr(3, 2), 16);
    var blue = parseInt(color.substr(5, 2), 16);
    return Math.round(((red/3 + green/3 + blue/3)/255)*100)/100;
}
