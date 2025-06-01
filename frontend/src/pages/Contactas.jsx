import "../pages-css/Contactas.css";

export const Contactas = () => {
    return (
        <>
            <div id="contact" className="contact-section">
                <h2 className="contact-name">Contact Us</h2>
                <p>For inquiries, feel free to reach out to us.</p>
                <a href="mailto:contact@hostelmanagement.com" className="email-button">
                    Email Us
                </a>
            </div>
        </>
    )
}