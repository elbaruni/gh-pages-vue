const IPFS = require("ipfs-api");
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});
async function getFileIPFS(ipfsHash) {
  console.log("action", ipfsHash);

  let file = await ipfs.get(ipfsHash);
  // console.log("get file", file[0].content.toString("utf8"));
  return file[0].content.toString("utf8");
}
export default getFileIPFS;
