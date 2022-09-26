FROM registry.starx.com/starx/starx-pro:base
COPY ./dist /opt/workspaces/starx-pro/dist
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 7132
CMD ["nginx","-g","daemon off;"]