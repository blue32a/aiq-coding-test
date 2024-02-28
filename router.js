const { URL } = require('url');
const InfluencerController = require('./app/controller/influencerController');
const ErrorController = require('./app/controller/errorController');

async function route(request, response) {
  const baseURL = `http://${request.headers.host}/`;
  const url = new URL(request.url, baseURL);

  if (url.pathname === '/influencers/by-average-likes') {
    await new InfluencerController().listByAverageLikes(request, response);
  } else if (url.pathname === '/influencers/by-average-comments') {
    await new InfluencerController().listByAverageComments(request, response);
  } else {
    new ErrorController().error404(request, response);
  }
}

exports.route = route;
