
//Versioning semantic : Major.minor.patch
export const APP_VERSION = "1.21.13";

/*
  Changelog (Last 15 changes):
  1. Fixed ActiveQuestPanel animation not playing by initializing state from session storage.
  2. Added sound effect with fade-in/fade-out for quest progress bar.
  3. Extracted companion data to data/companions.ts.
  4. Added 3 new companions: Zelda, Dee, and Fib.
  5. Enabled image support for companions with automatic fallback to icons.
  6. Disabled Admin 'Add Steps' button while quest progress animation is playing to prevent skipping logic.
  7. Isolated animation notification state logic in ActiveQuestPanel to ensure button reactivates reliably.
  8. Inverted health bar logic for normal enemies (depletes instead of fills).
  9. Added "Jump to Boss" Admin button in Home screen.
  10. Updated Combat Result Modal to show total HP lost during the fight.
  11. Moved "Continue" button outside the result modal box for better visibility.
  12. Added "Completed" overlay visual to Active Quest Panel when tome is finished.
  13. Added pulsing animation to Tome button when current quest is completed.
  14. Updated Admin 'Jump to Boss' to bypass random encounter checks.
  15. Changed 'Completed' overlay to Red text with drop shadow and moved Tome badge to bottom center saying 'NEW'.
*/
