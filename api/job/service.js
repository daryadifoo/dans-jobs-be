const axios = require("axios");
const Service = () => {
  const getPositions = async () => {
    try {
      const data = await axios.get(
        `http://dev3.dansmultipro.co.id/api/recruitment/positions.json`,
        {}
      );

      if (data.data) {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  };
  const getPositionsDetail = async (id) => {
    try {
      const data = await axios.get(
        `http://dev3.dansmultipro.co.id/api/recruitment/positions/${id}`,
        {}
      );
      if (data.data) {
        return data.data;
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  };

  return {
    getPositions,
    getPositionsDetail,
  };
};

module.exports = Service;
