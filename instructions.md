These steps outline how to build a dynamic portfolio website with Next.js and Tailwind CSS that uses Firebase for content management, secure login, real‐time updates, and image uploads.

- there should be a /login page using google login that leads to /admin page where i can create my portfolio by providing data to a form. It should then update my portfolio page at / route.
- I have already installed and setup tailwind css and firebase.
- I have also built and designed the porfolio page.tsx already but it is currently using hard coded data from protfolio-data.ts but it needs to instead come from firestore.

Create an Admin Dashboard:

- Create a page (e.g., pages/admin.tsx) that renders a form to update or add new portfolio fields.
- This dashboard allows an authenticated admin to update any section by specifying a section name.

- check the mock data of all the required sections and fields for the portfolio in /lib/protfolio-data.ts file:
- when form is submitted successfully or there is an error use the "sonner" toster from shadcn like toster.success("") etc.

Fetching Data for Components:

- Create a helper to fetch data from Firestore. For example, put every api/fetch logic in one file in (lib/api.ts)
- use the best fetching strategy for fast performance and make sure to optimize each data by caching all data when possible.
- make sure data is typed properly

- In your home page (pages/index.js), you can call this method to retrieve data for each section and then render the corresponding components:

Image Uploads & Storage Integration
Image Upload in Forms:

As shown in the Admin Dashboard instructions, use an HTML file input to capture the image file.

Upload the file using Firebase Storage (uploadBytesResumable) and obtain the download URL via getDownloadURL which is then stored in Firestore.

Additional Enhancements to Consider
Error Handling & Loading States: Incorporate proper loaders, error messages, and validations both in the admin form and in the data-fetching components.

SEO Optimization: Utilize Next.js features like next/head to incorporate SEO meta tags.

Custom Hooks: Create custom hooks (e.g., useFirebaseAuth or useFirestoreData) to encapsulate your Firebase queries and authentication logic for cleaner component code.
