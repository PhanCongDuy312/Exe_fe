const criteriaSet = [
  {
    label: "AI Engineer",
    criteria: [
      {
        name: "AISkills",
        example: "TensorFlow, PyTorch, Scikit-learn",
        score: 3,
      },
      {
        name: "CloudSkills",
        example: "AWS, Azure, GCP",
        score: 1,
      },
    ],
  },
  {
    label: "Data Scientist",
    criteria: [
      {
        name: "DataSkills",
        example: "SQL, NoSQL, Python, R, C++, Java, C, Matlab, Scala",
        score: 3,
      },
      {
        name: "CloudSkills",
        example: "AWS, Azure, GCP",
        score: 1,
      },
    ],
  },
  {
    label: "Blank",
    criteria: [],
  },
];

export default criteriaSet;
