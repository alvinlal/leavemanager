const httpLogger = (req, res, next) => {
  const requestDetails = `IP:${req.headers['x-forwarded-for'] || req.socket.remoteAddress}, USER-AGENT:${
    req.headers['user-agent']
  }, ROUTE:${req.originalUrl} `;

  global.logger.http(requestDetails);
  next();
};

export default httpLogger;
