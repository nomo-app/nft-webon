const sshHost = process.env.SSH_NFT_WEBON;
if (!sshHost) {
  throw new Error('SSH_NFT_WEBON is not set');
}

const nomoCliConfig = {
  "deployTargets": {
    "production": {
      "rawSSH": {
        "sshHost": sshHost,
        "sshBaseDir": "/var/www/production_webons/nft/",
        "publicBaseUrl": "https://nft.nomo.zone",
      }
    }
  }
};

module.exports = nomoCliConfig;