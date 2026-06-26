const testApi = (req, res) => {
  res.status(200).json({
    success: true,
    message: "IT Sparks Technologies backend API is working",
  });
};

export { testApi };