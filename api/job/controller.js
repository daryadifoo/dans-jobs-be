const fastify = require("fastify")({ logger: true });

const UserService = require("@root/api/user/service")({});
const JobService = require("./service")({});

const Controller = () => {
  const filterByValue = (array, string) => {
    return array.filter((o) =>
      Object.keys(o).some((k) =>
        (o[k] ? o[k] : "").toLowerCase().includes(string.toLowerCase())
      )
    );
  };

  const getPositions = async (request, reply) => {
    await UserService.verifyToken(request, reply);
    const query = request.query;

    let transformedData = [];

    try {
      const data = await JobService.getPositions();

      if (data.length > 0) {
        transformedData = data;
        if (query.description) {
          transformedData = filterByValue(
            transformedData,
            query.description.toLowerCase()
          );
        }

        if (query.location) {
          transformedData = transformedData.filter((element) =>
            element.location
              .toLowerCase()
              .includes(query.location.toLowerCase())
          );
        }

        if (query.full_time === "true") {
          transformedData = transformedData.filter(
            (element) => element.type.toLowerCase() === "full time"
          );
        }
      }

      if (query.page) {
        const perPage = 8; // asume 8 record per page
        const page = parseInt(query.page) - 1;
        const startIndex = page * perPage;
        const endIndex = startIndex + perPage;
        transformedData = transformedData.slice(startIndex, endIndex);
      }

      return reply.code(200).send(transformedData);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({
        status: "error",
      });
    }
  };

  const getPositionsDetail = async (request, reply) => {
    await UserService.verifyToken(request, reply);
    const params = request.params;

    try {
      const data = await JobService.getPositionsDetail(params.id);

      return reply.code(200).send(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({
        status: "error",
      });
    }
  };

  return {
    getPositions,
    getPositionsDetail,
  };
};

module.exports = Controller;
