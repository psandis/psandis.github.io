import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <>
      <header className="header-row">
        <div>
          <h1 className="heading">About the Author</h1>
          <p className="subhead">
            Technical Project Manager who codes | AI & Cloud (Azure/AWS) | delivers software to production on schedule.
          </p>
        </div>
        <Link className="about-btn" to="/">
          Back to Projects
        </Link>
      </header>

      <section className="bio">
        <p className="bio__lead">
          I solve business problems with technology. Over 20 years in IT, I've learned that the best solutions are simple ones
          that actually work for real people. I speak both business and technical fluently—translating needs for developers and
          explaining complex tech to executives without jargon.
        </p>
        <div className="bio__list">
          <div className="bio__section">
            <h3>What I Do</h3>
            <ul>
              <li>Turn messy business challenges into working technology solutions.</li>
              <li>Build applications and automate repetitive workflows.</li>
              <li>Assess if technology should solve a problem, what it costs, and if it’s worth it.</li>
            </ul>
          </div>
          <div className="bio__section">
            <h3>Approach</h3>
            <ul>
              <li>Bridge business and engineering; clear requirements and plain-language explanations.</li>
              <li>Mentor teams; help people master new skills and solve tough problems.</li>
              <li>Lead without ego—hire smart people and let them excel.</li>
            </ul>
          </div>
          <div className="bio__section">
            <h3>Good At</h3>
            <ul>
              <li>Building custom applications that solve specific business problems.</li>
              <li>Automating recurring tasks to free up people’s time.</li>
              <li>Workshops that surface the real problem before jumping to solutions.</li>
              <li>Managing client relationships with honest expectations.</li>
            </ul>
          </div>
          <div className="bio__section">
            <h3>Current Focus</h3>
            <ul>
              <li>Daily use of AI tools to prototype in hours instead of weeks.</li>
              <li>Adding productivity and quality with Azure/AWS and modern web stacks.</li>
            </ul>
          </div>
          <div className="bio__section">
            <h3>Drives Me</h3>
            <ul>
              <li>Learning, solving meaningful puzzles, and helping teams work better.</li>
              <li>Keeping technology simple so it makes life easier, not more complicated.</li>
            </ul>
          </div>
          <div className="bio__section">
            <h3>Top Skills</h3>
            <ul>
              <li>Solution Architecture • IT Service Management • Coaching</li>
              <li>Agile Methodologies • Product Development</li>
            </ul>
          </div>
          <div className="bio__section">
            <h3>Links</h3>
            <ul>
              <li><a href="https://github.com/psandis" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/psandis" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
