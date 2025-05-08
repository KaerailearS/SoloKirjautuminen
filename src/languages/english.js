const english = {
  morningText: "Good morning!",
  localCounter: "Logins since last reset: ",
  globalCounter: "Total logins: ",
  errorNotification: ` is already logged in.`,
  adminPanel: "Admin Panel",
  adminNote: "Please do not abuse this menu",
  newWorkerPlaceholder: "New worker name",
  addWorker: "Add worker",
  saveButton: "Save",
  archiveButton: "Archive",
  logoutButton: "Logout",
  massLogoutNote: "Force mass logout incase of stuck state",
  massLogoutButton: "Mass Logout",
  toggleArchiveButton: "Toggle archive",
  inactiveWorkers: "Inactive Workers",
  reactivateButton: "Reactivate",
  loginSuccess: (name, time, totalMinutesLate) => `${name} logged in at ${time}. On time! Total late: ${totalMinutesLate}`,
  loginLate: (name, time, minutesLate, totalMinutesLate) => `${name} logged in at ${time} - ${minutesLate} minutes late! Total late: ${totalMinutesLate}`
}

export default english;