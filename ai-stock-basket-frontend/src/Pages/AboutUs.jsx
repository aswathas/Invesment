import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="header-section">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">
          Empowering Investors with Cutting-Edge Tools and Insights for Smarter
          Investing
        </p>
      </div>
      <div className="about-content">
        <div className="about-box">
          <h2 className="box-title">Our Mission</h2>
          <p>
            At <strong>InvestIQ</strong>, we are committed to helping investors
            make well-informed decisions by providing deep stock sentiment
            analysis and personalized investment recommendations.
          </p>
          <div className="box-icon">
            <i className="fa-solid fa-bullseye"></i>
          </div>
        </div>
        <div className="about-box">
          <h2 className="box-title">Our Tools</h2>
          <p>
            Our platform leverages advanced AI-driven tools to analyze market
            sentiment, detect investment opportunities, and provide users with
            data-backed recommendations for optimal financial growth.
          </p>
          <div className="box-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
        </div>
        <div className="about-box">
          <h2 className="box-title">Our Team</h2>
          <p>
            Founded by experts in the finance and tech sectors, we are
            passionate about empowering investors—whether seasoned or new— to
            take control of their financial future.
          </p>
          <div className="box-icon">
            <i className="fa-solid fa-users"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
