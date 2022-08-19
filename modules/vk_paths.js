function authPath(client_id, redirect_uri, scope) {
  return `https://oauth.vk.com/authorize?client_id=${client_id}&display=page&redirect_uri=${redirect_uri}&scope=${scope}&response_type=code&v=5.131`;
}

function getAccessToken(client_id, redirect_uri, secret, code) {
  return `https://oauth.vk.com/access_token?client_id=${client_id}&client_secret=${secret}&redirect_uri=${redirect_uri}&code=${code}`;
}

function user_get(user_id, token, fields) {
  return `https://api.vk.com/method/users.get?user_ids=${user_id}&fields=${fields}&access_token=${token}&v=5.131`;
}

function friends_get(oauth_model, count, offset, fields) {
  return `https://api.vk.com/method/friends.get?user_ids=${oauth_model.user_id}&count=${count}&offset=${offset}&fields=${fields}&access_token=${oauth_model.access_token}&v=5.131`;
}

export { authPath, getAccessToken, user_get, friends_get };
