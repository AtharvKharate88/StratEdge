let teamStats = {};
let deliveriesData = [];
let playerImpactData = [];
let venueData = {};

const setTeamStats = (stats) => {
  teamStats = stats;
};

const getTeamStats = () => teamStats;

const setDeliveriesData = (data) => {
  deliveriesData = data;
};

const setPlayerImpactData = (data) => {
  playerImpactData = data;
};

const setVenueData = (data) => {
  venueData = data;
};

const getDeliveriesData = () => deliveriesData;
const getPlayerImpactData = () => playerImpactData;
const getVenueData = () => venueData;

module.exports = {
  setTeamStats,
  getTeamStats,
  setDeliveriesData,
  getDeliveriesData,
  setPlayerImpactData,
  getPlayerImpactData,
  setVenueData,
  getVenueData,
};