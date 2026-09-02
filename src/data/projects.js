export const projectsData = [
  {
    id: "ai-interview-simulator",
    title: "AI Interview Simulator",
    tagline: "Full-stack simulation platform for AI-powered technical interviews and candidate evaluations.",
    category: "Full-Stack & AI",
    summary: "Built a full-stack AI Interview Simulator using React and Spring Boot. Integrated the Groq API to generate interview questions and AI-powered candidate evaluation.",
    technologies: ["Java", "Spring Boot", "React", "REST APIs", "Groq API"],
    bullets: [
      "Built a full-stack AI Interview Simulator using React and Spring Boot.",
      "Integrated the Groq API to generate interview questions and AI-powered candidate evaluation.",
      "Engineered backend REST endpoints to coordinate communication between the React interface and the Groq LLM."
    ],
    architecture: {
      title: "AI Interview Simulator Architecture Pipeline",
      steps: [
        {
          label: "React UI",
          role: "Frontend Interface",
          desc: "Interactive web client handling interview sessions and user responses."
        },
        {
          label: "Spring Boot",
          role: "Backend Application",
          desc: "Manages session state, orchestration, and business logic in Java."
        },
        {
          label: "REST APIs",
          role: "Communication Layer",
          desc: "Structured HTTP endpoints connecting frontend and backend services."
        },
        {
          label: "Groq API",
          role: "Inference Engine",
          desc: "High-speed LLM inference for real-time prompt completion."
        },
        {
          label: "Interview Questions / Candidate Evaluation",
          role: "Output & Feedback",
          desc: "Generates tailored interview questions and AI-assisted performance evaluations."
        }
      ]
    },
    links: [
      { label: "Frontend", url: "https://github.com/Milind2285/ai-interview-frontend", type: "github" },
      { label: "Backend", url: "https://github.com/Milind2285/ai-interview-backend", type: "github" },
      { label: "Live Demo", url: "https://ai-interview-frontend-chi.vercel.app/", type: "external" }
    ]
  },
  {
    id: "audio-comparison-tool",
    title: "Audio Comparison Tool",
    tagline: "Audio similarity application extracting MFCC and spectral acoustic features.",
    category: "Audio Analysis & DSP",
    summary: "Developed an audio similarity application using Librosa and SciPy. Extracted MFCC and spectral features for comparison.",
    technologies: ["Python", "Librosa", "SciPy"],
    bullets: [
      "Developed an audio similarity application using Librosa and SciPy.",
      "Extracted MFCC (Mel-frequency cepstral coefficients) and spectral features for comparison.",
      "Processed and analyzed acoustic signals to compute feature representations."
    ],
    architecture: {
      title: "Audio Processing & Similarity Pipeline",
      steps: [
        {
          label: "Audio Input",
          role: "Raw Signal",
          desc: "Digital audio waveforms loaded for acoustic analysis."
        },
        {
          label: "Librosa",
          role: "Audio Analysis Library",
          desc: "Performs time-frequency decomposition and signal processing in Python."
        },
        {
          label: "MFCC + Spectral Feature Extraction",
          role: "Feature Extraction",
          desc: "Extracts Mel-frequency cepstral coefficients and spectral acoustic characteristics."
        },
        {
          label: "Audio Similarity Comparison",
          role: "Feature Comparison (SciPy)",
          desc: "Compares extracted multidimensional feature sets to evaluate audio similarity."
        }
      ]
    },
    links: []
  },
  {
    id: "plant-disease-prediction",
    title: "Plant Disease Prediction System",
    tagline: "Deep learning CNN model for automated plant leaf disease classification.",
    category: "Computer Vision & Deep Learning",
    summary: "Built a CNN model for plant leaf disease classification. Applied preprocessing and data augmentation to improve prediction accuracy.",
    technologies: ["Python", "TensorFlow", "CNN"],
    bullets: [
      "Built a CNN model for plant leaf disease classification.",
      "Applied preprocessing and data augmentation to improve prediction accuracy.",
      "Trained deep learning visual representations using TensorFlow."
    ],
    architecture: {
      title: "Vision Classification Pipeline",
      steps: [
        {
          label: "Leaf Image",
          role: "Input Image",
          desc: "Raw photograph of agricultural leaf samples."
        },
        {
          label: "Preprocessing",
          role: "Image Standardization",
          desc: "Resizing, normalization, and color channel formatting."
        },
        {
          label: "Data Augmentation",
          role: "Dataset Enhancement",
          desc: "Geometric and photometric transformations to enhance generalization."
        },
        {
          label: "CNN",
          role: "TensorFlow Deep Learning Model",
          desc: "Hierarchical convolutional feature extractors and classification layers."
        },
        {
          label: "Disease Classification",
          role: "Diagnostic Output",
          desc: "Predicted plant disease category with associated confidence."
        }
      ]
    },
    links: [
      { label: "GitHub", url: "https://github.com/Milind2285/Plant-Disease-Prediction-System", type: "github" }
    ]
  }
];
