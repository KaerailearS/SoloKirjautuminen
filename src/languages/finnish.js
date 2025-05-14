// language file for finnish - neither language file contains alert popups
const finnish = {
  morningText: "Hyvää huomenta!",
  localCounter: "Kirjautumisia viime resetin jälkeen: ",
  globalCounter: "Kirjautumisia yhteensä: ",
  errorNotification: ` on jo kirjautunut sisään.`,
  infoNotification: `{name} kirjautui sisään kello {time} - {minutesLate} minuuttia myöhässä! Myöhästyminen yhteensä: {formatLateTime(worker.totalLateMinutes)}`,
  adminPanel: "Käyttäjänvalvojan paneeli",
  adminNote: "Älä väärinkäytä tätä valikkoa",
  newWorkerPlaceholder: "Uuden työntekijän nimi",
  addWorker: "Lisää työntekijä",
  saveButton: "Tallenna",
  archiveButton: "Arkistoi",
  logoutButton: "Kirjaa ulos",
  massLogoutNote: "Pakota Mass Logout jos tarpeen",
  massLogoutButton: "Mass Logout",
  toggleArchiveButton: "Näytä / piilota arkisto",
  inactiveWorkers: "Inaktiiviset työntekijät",
  reactivateButton: "Reaktivoi",
  loginSuccess: (name, time, totalMinutesLate) => `${name} kirjautui sisään kello ${time}. Ajoissa! Myöhästymiset yhteensä: ${totalMinutesLate}`,
  loginLate: (name, time, minutesLate, totalMinutesLate) => `${name} kirjautui sisään kello ${time} - ${minutesLate} minuuttia myöhässä! Myöhästymiset yhteensä: ${totalMinutesLate}`
}

export default finnish;