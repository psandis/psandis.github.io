import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <>
      <header className="header-row">
        <div>
          <h1 className="heading">About the Author</h1>
          <p className="subhead">
            Engineering Manager / Team Lead | Building focused teams, clear priorities, and reliable delivery | AI & Cloud (Azure, AWS) | 20+ years in telecom, banking, and large-scale platforms
          </p>
        </div>
        <Link className="about-btn" to="/" aria-label="Back to projects">
          Back to Projects
        </Link>
      </header>

      <section className="bio">
        <p className="bio__lead">
          I’m an engineering leader with 20+ years of experience delivering business-critical systems in telecom, banking, and regulated environments.
        </p>

        <p>
          Over time, my focus has shifted from designing systems to leading teams, creating clarity, removing blockers early, and keeping delivery predictable even when priorities change.
        </p>

        <p>
          I’ve led distributed, cross-functional teams across engineering, product, and architecture, with responsibility spanning roadmap execution, stakeholder alignment, vendor coordination, and production reliability.
        </p>

        <p>In practice, that means:</p>

        <ul>
          <li>Turning business goals into clear scope, priorities, and delivery plans</li>
          <li>Making trade-offs explicit so teams and stakeholders understand decisions</li>
          <li>Keeping delivery realistic when scope, timelines, or expectations shift</li>
        </ul>

        <p>
          As a team lead, I focus on clarity and momentum. Teams work best when priorities are visible, ownership is clear, and obstacles are removed early.
        </p>

        <p>
          I’m particularly interested in roles where leadership, delivery responsibility, and technical decision-making come together.
        </p>

        <div className="bio__list">

          <div className="bio__section">
            <h3>What I Do</h3>
            <ul>
              <li>Turn unclear business needs into scoped work: priorities, decisions, and a delivery plan.</li>
              <li>Design and steer platform and integration work across cloud and enterprise systems.</li>
              <li>Evaluate technology pragmatically: risk, cost, timeline, and operational impact.</li>
            </ul>
          </div>

          <div className="bio__section">
            <h3>Approach</h3>
            <ul>
              <li>Translate business goals into concrete scope, priorities, and delivery plans teams can execute.</li>
              <li>Run workshops that surface real constraints early (data, integrations, security, ownership, timelines).</li>
              <li>Keep delivery predictable by aligning stakeholders before work begins.</li>
            </ul>
          </div>

          <div className="bio__section">
            <h3>Good At</h3>
            <ul>
              <li>Leading delivery across cross-functional teams and vendors in complex environments.</li>
              <li>Integration and platform work: APIs, event flows, and data handoffs between systems.</li>
              <li>Workshops that turn unclear discussions into concrete decisions.</li>
              <li>Keeping stakeholders aligned when priorities change.</li>
              <li>Improving operational reliability through clear ownership and follow-ups.</li>
            </ul>
          </div>

          <div className="bio__section">
            <h3>Current Focus</h3>
            <ul>
              <li>Building teams that deliver reliably through clarity, ownership, and focus.</li>
              <li>Using AI tools to accelerate prototyping, documentation, and repetitive engineering tasks.</li>
              <li>Applying modern cloud and integration practices with AWS and Azure.</li>
            </ul>
          </div>

          <div className="bio__section">
            <h3>Drives Me</h3>
            <ul>
              <li>Solving meaningful technical and organizational problems.</li>
              <li>Helping teams work more effectively without unnecessary complexity.</li>
            </ul>
          </div>

          <div className="bio__section">
            <h3>Top Skills</h3>
            <ul>
              <li>Engineering Leadership • Solution & Integration Architecture • Delivery Governance • Coaching</li>
              <li>Cloud (AWS / Azure) • Agile Delivery • Stakeholder & Vendor Management</li>
            </ul>
          </div>

          <div className="bio__section">
            <h3>Links</h3>
            <ul>
              <li>
                <a href="https://github.com/psandis" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/psandis" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

        </div>
      </section>
    </>
  );
};

export default AboutPage;
