import ky from "ky";

const api = ky.extend({
  prefixUrl: `${Bun.env.API_URL}:${Bun.env.API_PORT}/api`,
  retry: 0,
  timeout: 60000,
  hooks: {
    beforeRequest: [
      async (request, _options) => {
        if (
          !request.url.endsWith("create-user") &&
          !request.url.endsWith("login")
        ) {
          const token = localStorage.getItem("token");
          request.headers.set("Authorization", `Bearer ${token}`);
          request.headers.set("Access-Control-Allow-Origin", "*");
          request.headers.set("Access-Control-Allow-Headers", "*");
        }
      },
    ],
  },
});

export default api;
