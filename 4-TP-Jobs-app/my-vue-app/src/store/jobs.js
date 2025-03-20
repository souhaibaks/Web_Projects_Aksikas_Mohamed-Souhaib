import { reactive } from 'vue'

export const jobsStore = reactive({
  jobs: [
    {
      id: 1,
      titre: "Développeur Web",
      description: "Responsable de la création et de la maintenance de sites web modernes et responsives.",
      salaire: "35 000 MAD/an",
      "date de création": "2025-03-17"
    },
    {
      id: 2,
      titre: "Data Analyst",
      description: "Analyse des données pour aider à la prise de décision stratégique.",
      salaire: "50 000 MAD/an",
      "date de création": "2025-03-15"
    },
    {
      id: 3,
      titre: "Chef de Projet IT",
      description: "Gestion de projets informatiques de bout en bout, coordination des équipes techniques.",
      salaire: "70 000 MAD/an",
      "date de création": "2025-03-10"
    },
    {
      id: 4,
      titre: "Ingénieur Logiciel",
      description: "Développement d'applications logicielles robustes et performantes pour divers clients.",
      salaire: "60 000 MAD/an",
      "date de création": "2025-02-28"
    },
    {
      id: 5,
      titre: "Designer UX/UI",
      description: "Création d'interfaces utilisateur intuitives et attrayantes pour améliorer l'expérience client.",
      salaire: "40 000 MAD/an",
      "date de création": "2025-03-01"
    },
    {
      id: 6,
      titre: "Responsable Marketing Digital",
      description: "Élaboration de stratégies de marketing en ligne pour accroître la visibilité de l'entreprise.",
      salaire: "55 000 MAD/an",
      "date de création": "2025-02-25"
    },
    {
      id: 7,
      titre: "Consultant en Cybersécurité",
      description: "Conseiller les entreprises sur la sécurisation de leurs systèmes informatiques et réseaux.",
      salaire: "80 000 MAD/an",
      "date de création": "2025-03-12"
    },
    {
      id: 8,
      titre: "Technicien Réseaux",
      description: "Installation, configuration et maintenance des équipements réseau.",
      salaire: "30 000 MAD/an",
      "date de création": "2025-02-20"
    },
    {
      id: 9,
      titre: "Assistant Administratif",
      description: "Gestion administrative, accueil téléphonique et suivi des dossiers clients.",
      salaire: "25 000 MAD/an",
      "date de création": "2025-03-05"
    },
    {
      id: 10,
      titre: "Commercial B2B",
      description: "Prospection et gestion d'un portefeuille de clients professionnels.",
      salaire: "45 000 MAD/an",
      "date de création": "2025-03-14"
    }
  ],
  
  addJob(job) {
    const newId = this.jobs.length > 0 ? Math.max(...this.jobs.map(j => j.id)) + 1 : 1;
    this.jobs.push({ ...job, id: newId });
  },

  updateJob(updatedJob) {
    const index = this.jobs.findIndex(job => job.id === updatedJob.id);
    if (index !== -1) {
      this.jobs[index] = updatedJob;
    }
  },

  deleteJob(id) {
    const index = this.jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      this.jobs.splice(index, 1);
    }
  },

  getJobById(id) {
    return this.jobs.find(job => job.id === parseInt(id));
  }
}); 