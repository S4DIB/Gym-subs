import ContactForm from "@/components/contact-form";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="pt-24">
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}


