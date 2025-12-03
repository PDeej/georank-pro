import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase"; // adjust this path if needed

const db = getFirestore(firebaseApp);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  // 👇 Optional custom pages
  pages: {
    signIn: '/auth/signin',
    newUser: '/dashboard', // redirect first-time users to dashboard
  },

  callbacks: {
    async signIn({ user }) {
      const userRef = doc(db, 'users', user.email!);

      await setDoc(userRef, {
        name: user.name,
        email: user.email,
        image: user.image || null,
        createdAt: new Date(),
      }, { merge: true });

      return true;
    },

    async redirect({ url, baseUrl }) {
      return '/dashboard'; // always redirect to dashboard after login
    }
  }
});

export { handler as GET, handler as POST };
