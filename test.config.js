// F.E.R. test — runtime config.
// Loaded by test.html before the Firebase module boots.
//
// NOTE: For a static site, any value in this file is visible in the deployed
// browser source. The Firebase apiKey and ConvertKit public api_key are both
// documented as public identifiers — security comes from:
//   1. HTTP referrer restriction on the Firebase API key (GCP Console →
//      APIs & Services → Credentials → edit the auto-created "Browser key").
//   2. Firestore security rules. Deploy these (Firebase Console → Firestore →
//      Rules → paste → Publish):
//
//        rules_version = '2';
//        service cloud.firestore {
//          match /databases/{database}/documents {
//            match /test_respuestas/{doc} {
//              allow create: if
//                   request.resource.data.email is string
//                && request.resource.data.email.size() <= 254
//                && request.resource.data.email.matches('.*@.*\\..*')
//                && request.resource.data.name is string
//                && request.resource.data.name.size() <= 120
//                && request.resource.data.keys().size() <= 40
//                && request.time < timestamp.date(2099, 1, 1);
//              allow read, update, delete: if false;
//            }
//          }
//        }
//
//   3. ConvertKit form ID + public key together only allow form subscription
//      (no reads, no writes against other data).
window.__FER_CONFIG = {
  firebase: {
    apiKey: 'AIzaSyBj9X3tpqgIEYLyfGZpuBe33qnNsvg4-Hw',
    authDomain: 'ferbolagay-firebase.firebaseapp.com',
    projectId: 'ferbolagay-firebase',
    storageBucket: 'ferbolagay-firebase.appspot.com',
    messagingSenderId: '44330468225',
    appId: '1:44330468225:web:70af0b32cb2f4b262e9e80',
    measurementId: 'G-CRJ0582LNY',
  },
  // TODO: replace with the new F.E.R.-test-specific ConvertKit form + verify
  // the automation in CK uses the custom fields listed in test.html.
  convertkit: {
    formId: '5366078',
    apiKey: 'LRpn9kJWEXGg_mlr_kp2vg',
  },
  firestore: {
    collection: 'test_respuestas',
  },
};
