import { dbConnect, query } from "@/lib/dbConnect";
import Link from "next/link";

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  let project = null;
  
  try {
    console.log(`📄 Project Page: Attempting PostgreSQL connection for ${slug}...`);
    await dbConnect();
    console.log(`📄 Project Page: PostgreSQL connected, fetching project ${slug}`);
    const result = await query('SELECT * FROM projects WHERE slug = $1', [slug]);
    if (result.rows.length > 0) {
      const row = result.rows[0];
      project = {
        _id: row._id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        heroImage: row.hero_image,
        status: row.status,
        visible: row.visible,
        order: row.order,
        startDate: row.start_date,
        endDate: row.end_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    }
    console.log(`📄 Project Page: Found project in PostgreSQL:`, project ? 'Yes' : 'No');
  } catch (error) {
    console.error(`📄 Project Page: PostgreSQL connection failed for ${slug}:`, error.message);
    console.error(`📄 Project Page: No fallback data available`);
    project = null;
  }
  
  if (!project) {
    return (
      <main>
        <h1 className="text-xl font-semibold">Project not found</h1>
      </main>
    );
  }
  
  // Always show the full project content

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-media"></div>
        <div className="hero-overlay"></div>
        <div className="hero-inner container-lg">
          <div className="kicker">Research · Policy · Delivery</div>
          <h1 className="h1">{project.title}</h1>
          <p className="lead">{project.summary || "Understanding how women-led households navigate displacement, livelihoods, and aspirations in Somalia."}</p>
          <div className="cta-row">
            <a className="btn btn-fill" href="#recommendations">Read recommendations</a>
            <a className="btn btn-ghost" href="#human_stories">Jump to field voices</a>
          </div>
        </div>
      </section>

      <main id="main_content">
        {/* Introduction */}
        <section id="intro" className="section-pad">
          <div className="container-lg overlap-wrap left">
            <figure className="media-wrap overlap-img">
              <img className="media" src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_800,f_auto,q_auto/raagsan/sepow/intro" alt="Introduction" loading="lazy" decoding="async" />
              <figcaption>Photo: Raagsan field team</figcaption>
            </figure>
            <div className="card">
              <h2 className="h2">Introduction</h2>
              <p>
                SEPOW (Socio-Economic Participation of Women-led Households) responds to cycles of conflict, drought,
                and poverty that push families to the margins. The baseline frames realities on service access,
                livelihoods, coping strategies, and the goals women set for their families.
              </p>
              <h3 className="h3">What this story covers</h3>
              <ul className="bullets">
                <li>Context and purpose of SEPOW</li>
                <li>Who participated and why their voices matter</li>
                <li>How findings translate into practical actions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Full bleed photo */}
        <figure className="photo-block">
          <div className="photo-wrap">
            <img src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_1200,f_auto,q_auto/raagsan/sepow/fullbleed_01" alt="Field interview moment" loading="lazy" decoding="async" />
            <div className="photo-overlay"></div>
          </div>
          <figcaption>Photo: Raagsan field team</figcaption>
        </figure>

        {/* Objectives & Methodology */}
        <section id="objectives_method" className="section-pad band">
          <div className="container-lg overlap-wrap right">
            <figure className="media-wrap overlap-img">
              <img className="media" src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_800,f_auto,q_auto/raagsan/sepow/objectives" alt="Objectives" loading="lazy" decoding="async" />
              <figcaption>Photo: Raagsan field team</figcaption>
            </figure>
            <div className="card">
              <h2 className="h2">Study objectives & methodology</h2>
              <p>
                We set out to establish a clear baseline on access to services, income and food security,
                decision-making, and aspirations among women-led households — to guide adaptive programming.
              </p>
              <h3 className="h3">Objectives</h3>
              <ul className="bullets tight">
                <li>Map barriers in housing, health, education, WASH, and energy</li>
                <li>Understand income sources, shocks, and coping strategies</li>
                <li>Elevate women's priorities into programme design</li>
              </ul>
              <h3 className="h3">Methodology</h3>
              <p>
                Household surveys, focus group discussions, and key informant interviews across IDP and host communities,
                with participation, consent, and safeguarding embedded.
              </p>
              <blockquote className="pull">"We tailored methods to the decisions women needed to make."</blockquote>
            </div>
          </div>
        </section>

        {/* Demographics */}
        <section id="demographics" className="section-pad">
          <div className="container-lg overlap-wrap split">
            <figure className="media-wrap overlap-img corner">
              <img className="media" src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_800,f_auto,q_auto/raagsan/sepow/demographics" alt="Demographics" loading="lazy" decoding="async" />
              <figcaption>Photo: Raagsan field team</figcaption>
            </figure>
            <div className="card">
              <h2 className="h2">Demographic data</h2>
              <p>
                Households are large (often 6–7 members) with high dependency ratios. Education levels are low,
                especially for women, and unemployment is widespread.
              </p>
              <h3 className="h3">Who we met</h3>
              <ul className="bullets">
                <li>Women-led households across IDP and host locations</li>
                <li>Long-term displacement histories common</li>
                <li>High care burdens and limited formal schooling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Social Services */}
        <section id="services" className="section-pad band">
          <div className="container-lg overlap-wrap right">
            <figure className="media-wrap overlap-img">
              <img className="media" src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_800,f_auto,q_auto/raagsan/sepow/social" alt="Social services" loading="lazy" decoding="async" />
              <figcaption>Photo: Raagsan field team</figcaption>
            </figure>
            <div className="card">
              <h2 className="h2">Access to social services</h2>
              <p>
                Barriers compound: distance and cost, tenure insecurity, and uneven quality create daily trade-offs.
              </p>
              <h3 className="h3">Housing & land</h3>
              <p>Insecure tenure and fragile shelters drive frequent moves and lost income.</p>
              <h3 className="h3">Health & education</h3>
              <p>Travel time and fees limit consistent care and school attendance.</p>
              <h3 className="h3">Water & sanitation</h3>
              <p>Reliance on kiosks/wells and shared latrines affects dignity and safety.</p>
              <h3 className="h3">Energy</h3>
              <p>IDPs rely on solar lamps/firewood; hosts more often connect to the grid.</p>
            </div>
          </div>
        </section>

        {/* Income & Food */}
        <section id="income_food" className="section-pad">
          <div className="container-lg overlap-wrap left">
            <figure className="media-wrap overlap-img">
              <img className="media" src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_800,f_auto,q_auto/raagsan/sepow/food" alt="Food" loading="lazy" decoding="async" />
              <figcaption>Photo: Raagsan field team</figcaption>
            </figure>
            <div className="card">
              <h2 className="h2 h2-giz">Household income & food security</h2>
              <p>
                Women are primary earners yet income is irregular and low. Petty trade and casual labour dominate,
                with borrowing used to smooth shocks. Diets narrow when income drops.
              </p>
              <h3 className="h3">Income & coping</h3>
              <ul className="bullets">
                <li>Small, volatile earnings from trade and casual work</li>
                <li>Borrowing and reduced meals used during shocks</li>
              </ul>
              <h3 className="h3">Food patterns</h3>
              <p>Many households eat 1–2 meals/day; staple-heavy diets; proteins and vegetables added when possible.</p>
              <blockquote className="pull">"When we have money, we add vegetables. Without it, we drink tea and wait."</blockquote>
            </div>
          </div>
        </section>

        {/* Social Capital */}
        <section id="social_capital" className="section-pad band">
          <div className="container-lg overlap-wrap right">
            <figure className="media-wrap overlap-img">
              <img className="media" src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_800,f_auto,q_auto/raagsan/sepow/business" alt="Social capital" loading="lazy" decoding="async" />
              <figcaption>Photo: Raagsan field team</figcaption>
            </figure>
            <div className="card">
              <h2 className="h2">Social capital</h2>
              <p>
                Social ties are a lifeline, yet not all groups benefit equally. Interest in savings/self-help groups is strong.
              </p>
              <h3 className="h3">Participation</h3>
              <p>Low current SHG membership; high willingness to join when pathways and trust exist.</p>
              <h3 className="h3">Decision-making</h3>
              <p>Women lead many household decisions while balancing heavy care work.</p>
              <h3 className="h3">Inclusion risks</h3>
              <p>Some households are at the edges of support networks and miss key opportunities.</p>
            </div>
          </div>
        </section>

        {/* Vocational & Business */}
        <section id="vocational_business" className="section-pad">
          <div className="container-lg overlap-wrap split">
            <div className="card">
              <h2 className="h2">Vocational training & business</h2>
              <p>
                Demand for practical skills is high, but training and finance access are limited. Mentoring and starter capital
                can convert effort into stable income.
              </p>
              <h3 className="h3">Skills & access</h3>
              <p>Training opportunities are scarce; relevance and timing matter.</p>
              <h3 className="h3">Enterprise</h3>
              <p>Micro-businesses open/close with capital constraints; market links improve survival.</p>
            </div>
          </div>
        </section>

        {/* Field Voices */}
        <section id="human_stories" className="section-pad band">
          <div className="container-lg overlap-wrap left">
            <figure className="media-wrap overlap-img">
              <img className="media" src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_800,f_auto,q_auto/raagsan/sepow/field-voices" alt="Field voices" loading="lazy" decoding="async" />
              <figcaption>Photo: Raagsan field team</figcaption>
            </figure>
            <div className="card">
              <h2 className="h2">Field voices</h2>
              <p><strong>Fartun:</strong> "I close my stall when floods come. With earlier alerts, I can prepare and save goods."</p>
              <p><strong>Halima:</strong> "Borrowing from neighbours is the only way to feed children when income stops."</p>
              <p><strong>Asha:</strong> "If I had a sewing machine, I could keep my daughters in school."</p>
              <p className="small muted">Some identities and details are changed for privacy.</p>
            </div>
          </div>
        </section>

        {/* Conclusions */}
        <section id="conclusions" className="section-pad band">
          <div className="container-lg overlap-wrap left">
            <figure className="media-wrap overlap-img">
              <img className="media" src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_800,f_auto,q_auto/raagsan/sepow/conclusions" alt="Conclusions" loading="lazy" decoding="async" />
              <figcaption>Photo: Raagsan field team</figcaption>
            </figure>
            <div className="card">
              <h2 className="h2">Conclusions</h2>
              <p>
                The baseline affirms that women-led households aspire to dignity, education, and steady income.
                Closing the gap between evidence and delivery means listening, coordinating plainly, and iterating with communities.
              </p>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section id="recommendations" className="section-pad">
          <div className="container-lg overlap-wrap right">
            <figure className="media-wrap overlap-img">
              <img className="media" src="https://res.cloudinary.com/dxcjrsrna/image/upload/w_800,f_auto,q_auto/raagsan/sepow/recommendations" alt="Recommendations" loading="lazy" decoding="async" />
              <figcaption>Photo: Raagsan field team</figcaption>
            </figure>
            <div className="card">
              <h2 className="h2 h2-giz">Recommendations</h2>
              <h3 className="h3">Livelihoods</h3>
              <p>Mentoring + small grants for women-led enterprise; market links for resilience.</p>
              <h3 className="h3">Nutrition-sensitive support</h3>
              <p>Pair income assistance with practical guidance and affordable choices.</p>
              <h3 className="h3">SHGs</h3>
              <p>Grow savings groups as platforms for skills, inclusion, and voice.</p>
              <h3 className="h3">Service coordination</h3>
              <p>Contact trees and clear referral pathways to close response gaps.</p>
            </div>
          </div>
        </section>

        {/* About & Co-creation */}
        <section id="about" className="section-pad">
          <div className="container-lg overlap-wrap split">
            <div className="card">
              <h2 className="h2">About & co-creation</h2>
              <p><strong>Raagsan</strong> connects communities, government, and partners to turn research into practical delivery.</p>
              <p>
                We have worked with <strong>GIZ</strong> among other partners. Their partnership supports integrated
                approaches that link livelihoods, skills, and services around women-led households.
              </p>
              <div className="logo-bar">
                <a href="https://raagsan.com" className="logo-chip" aria-label="Raagsan homepage">
                  <img src="https://res.cloudinary.com/dxcjrsrna/image/upload/raagsan/sepow/Raagsan-logo" alt="Raagsan logo" width="120" height="60" />
                </a>
                <span className="logo-chip" aria-label="GIZ">
                  <img src="https://res.cloudinary.com/dxcjrsrna/image/upload/raagsan/sepow/GIZ-logo" alt="GIZ logo" width="120" height="60" />
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


