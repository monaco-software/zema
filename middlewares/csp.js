const CSPHeader = `
    default-src 'self';
    connect-src https://ya-praktikum.tech wss://ya-praktikum.tech;
    font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
    img-src 'self' blob: data: https://ya-praktikum.tech https://ssl.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    script-src 'self' 'unsafe-inline';`;

module.exports = {
  cspHeader: function (req, res, next) {
    res.setHeader('Content-Security-Policy', CSPHeader.replace(/(\r\n|\n|\r| {2})/gm, ''));
    next();
  }
}
