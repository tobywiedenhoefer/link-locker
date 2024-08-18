import ky from "ky";

const api = ky.extend({
  prefixUrl: `${Bun.env.API_URL}:${Bun.env.API_PORT}/api`,
  retry: 0,
  hooks: {
    beforeRequest: [
      async (request, _options) => {
        if (!request.url.endsWith("create-user")) {
          const token = localStorage.getItem("token");
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export default api;
