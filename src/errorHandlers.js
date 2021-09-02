export const notFoundErrorHandler = (err, req, resp, next) => {
  if (err.status === 404) {
    resp.status(404).send(err.message || "Error not found");
  } else {
    next(err);
  }
};

export const badRequestErrorHandler = (err, req, resp, next) => {
  if (err.status === 400 || err.name === "ValidationError") {
    resp.status(400).send(err.errors);
  } else {
    next(err);
  }
};

export const catchAllErrorHandlers = (err, req, resp, next) => {
  console.log(err);
  resp.status(500).send("Generic Server Error");
};
