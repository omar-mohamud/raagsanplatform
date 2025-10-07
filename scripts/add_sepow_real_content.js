import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

let dbConnect; let Project; let Story;

async function main() {
  ({ dbConnect } = await import("../lib/dbConnect.js"));
  ({ default: Project } = await import("../models/Project.js"));
  ({ default: Story } = await import("../models/Story.js"));

  await dbConnect();
  const project = await Project.findOne({ slug: "sepow" });
  if (!project) throw new Error("Project 'sepow' not found");

  // Update project with proper SEPOW content
  project.title = "Socio-Economic Participation of Women-led Households (SEPOW)";
  project.summary = "Understanding how women-led households navigate displacement, livelihoods, and aspirations in Somalia.";
  await project.save();

  // Find gallery story and replace with real content
  const story = await Story.findOne({ projectId: project._id, slug: "gallery" });
  if (!story) throw new Error("Story 'gallery' not found for sepow");

  const realContent = [
    { type: "heading", level: 1, text: "Socio-Economic Participation of Women-led Households (SEPOW)" },
    { type: "text", content: "Understanding how women-led households navigate displacement, livelihoods, and aspirations in Somalia." },
    { type: "text", content: "SEPOW (Socio-Economic Participation of Women-led Households) responds to cycles of conflict, drought, and poverty that push families to the margins. The baseline frames realities on service access, livelihoods, coping strategies, and the goals women set for their families." },
    
    { type: "heading", level: 2, text: "Introduction" },
    { type: "text", content: "SEPOW (Socio-Economic Participation of Women-led Households) responds to cycles of conflict, drought, and poverty that push families to the margins. The baseline frames realities on service access, livelihoods, coping strategies, and the goals women set for their families." },
    { type: "text", content: "### What this story covers" },
    { type: "text", content: "• Context and purpose of SEPOW\n• Who participated and why their voices matter\n• How findings translate into practical actions" },
    
    { type: "heading", level: 2, text: "Study objectives & methodology" },
    { type: "text", content: "We set out to establish a clear baseline on access to services, income and food security, decision-making, and aspirations among women-led households — to guide adaptive programming." },
    { type: "text", content: "### Objectives" },
    { type: "text", content: "• Map barriers in housing, health, education, WASH, and energy\n• Understand income sources, shocks, and coping strategies\n• Elevate women's priorities into programme design" },
    { type: "text", content: "### Methodology" },
    { type: "text", content: "Household surveys, focus group discussions, and key informant interviews across IDP and host communities, with participation, consent, and safeguarding embedded." },
    { type: "text", content: "> \"We tailored methods to the decisions women needed to make.\"" },
    
    { type: "heading", level: 2, text: "Demographic data" },
    { type: "text", content: "Households are large (often 6–7 members) with high dependency ratios. Education levels are low, especially for women, and unemployment is widespread." },
    { type: "text", content: "### Who we met" },
    { type: "text", content: "• Women-led households across IDP and host locations\n• Long-term displacement histories common\n• High care burdens and limited formal schooling" },
    
    { type: "heading", level: 2, text: "Access to social services" },
    { type: "text", content: "Barriers compound: distance and cost, tenure insecurity, and uneven quality create daily trade-offs." },
    { type: "text", content: "### Housing & land" },
    { type: "text", content: "Insecure tenure and fragile shelters drive frequent moves and lost income." },
    { type: "text", content: "### Health & education" },
    { type: "text", content: "Travel time and fees limit consistent care and school attendance." },
    { type: "text", content: "### Water & sanitation" },
    { type: "text", content: "Reliance on kiosks/wells and shared latrines affects dignity and safety." },
    { type: "text", content: "### Energy" },
    { type: "text", content: "IDPs rely on solar lamps/firewood; hosts more often connect to the grid." },
    
    { type: "heading", level: 2, text: "Household income & food security" },
    { type: "text", content: "Women are primary earners yet income is irregular and low. Petty trade and casual labour dominate, with borrowing used to smooth shocks. Diets narrow when income drops." },
    { type: "text", content: "### Income & coping" },
    { type: "text", content: "• Small, volatile earnings from trade and casual work\n• Borrowing and reduced meals used during shocks" },
    { type: "text", content: "### Food patterns" },
    { type: "text", content: "Many households eat 1–2 meals/day; staple-heavy diets; proteins and vegetables added when possible." },
    { type: "text", content: "> \"When we have money, we add vegetables. Without it, we drink tea and wait.\"" },
    
    { type: "heading", level: 2, text: "Social capital" },
    { type: "text", content: "Social ties are a lifeline, yet not all groups benefit equally. Interest in savings/self-help groups is strong." },
    { type: "text", content: "### Participation" },
    { type: "text", content: "Low current SHG membership; high willingness to join when pathways and trust exist." },
    { type: "text", content: "### Decision-making" },
    { type: "text", content: "Women lead many household decisions while balancing heavy care work." },
    { type: "text", content: "### Inclusion risks" },
    { type: "text", content: "Some households are at the edges of support networks and miss key opportunities." },
    
    { type: "heading", level: 2, text: "Vocational training & business" },
    { type: "text", content: "Demand for practical skills is high, but training and finance access are limited. Mentoring and starter capital can convert effort into stable income." },
    { type: "text", content: "### Skills & access" },
    { type: "text", content: "Training opportunities are scarce; relevance and timing matter." },
    { type: "text", content: "### Enterprise" },
    { type: "text", content: "Micro-businesses open/close with capital constraints; market links improve survival." },
    
    { type: "heading", level: 2, text: "Field voices" },
    { type: "text", content: "**Fartun:** \"I close my stall when floods come. With earlier alerts, I can prepare and save goods.\"" },
    { type: "text", content: "**Halima:** \"Borrowing from neighbours is the only way to feed children when income stops.\"" },
    { type: "text", content: "**Asha:** \"If I had a sewing machine, I could keep my daughters in school.\"" },
    { type: "text", content: "Some identities and details are changed for privacy." },
    
    { type: "heading", level: 2, text: "Recommendations" },
    { type: "text", content: "### Livelihoods" },
    { type: "text", content: "Mentoring + small grants for women-led enterprise; market links for resilience." },
    { type: "text", content: "### Nutrition-sensitive support" },
    { type: "text", content: "Pair income assistance with practical guidance and affordable choices." },
    { type: "text", content: "### SHGs" },
    { type: "text", content: "Grow savings groups as platforms for skills, inclusion, and voice." },
    { type: "text", content: "### Service coordination" },
    { type: "text", content: "Contact trees and clear referral pathways to close response gaps." },
    
    { type: "heading", level: 2, text: "Conclusions" },
    { type: "text", content: "The baseline affirms that women-led households aspire to dignity, education, and steady income. Closing the gap between evidence and delivery means listening, coordinating plainly, and iterating with communities." },
    
    { type: "heading", level: 2, text: "About & co-creation" },
    { type: "text", content: "**Raagsan** connects communities, government, and partners to turn research into practical delivery." },
    { type: "text", content: "We have worked with **GIZ** among other partners. Their partnership supports integrated approaches that link livelihoods, skills, and services around women-led households." }
  ];

  story.sections = realContent;
  await story.save();
  console.log("Added real SEPOW content to story.");
}

main().catch((e) => { console.error(e); process.exit(1); });
