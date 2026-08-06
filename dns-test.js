import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

dns.resolveSrv("_mongodb._tcp.cluster0.cfthevk.mongodb.net", (err, records) => {
  console.log("SRV:", err || records);
});

dns.lookup("cluster0.cfthevk.mongodb.net", (err, address) => {
  console.log("LOOKUP:", err || address);
});