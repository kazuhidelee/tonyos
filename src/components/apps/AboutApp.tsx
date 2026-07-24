import { useState } from "react";
import { profile } from "../../data/portfolioContent";

export function AboutApp() {
  const educationEntries = toEducationEntries(profile.Education);
  const [view, setView] = useState<"feed" | "profile">("feed");
  const jumpToSection = (sectionId: string) => {
    const element = globalThis.document?.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white p-4 text-black">
      {view === "profile" ? (
        <ProfilePage
          educationEntries={educationEntries}
          onBack={() => setView("feed")}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <aside
            id="about-profile"
            className="border border-[#7f93bc] bg-[#f7f7f7] shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#b7b7b7]"
          >
            <div className="bg-[#3b5998] px-3 py-2 text-sm font-bold text-white">
              My Profile
            </div>
            <div className="p-3">
              <img
                src="/about-profile.png"
                alt="Tony Lee"
                draggable={false}
                className="block h-[150px] w-full select-none border border-[#b7b7b7] object-cover"
              />
              <div className="mt-3 text-[22px] font-bold leading-tight text-[#3b5998]">
                {profile.name}
              </div>
              <button
                type="button"
                onClick={() => setView("profile")}
                className="mt-1 block text-left text-sm text-[#777] hover:underline"
              >
                View My Profile
              </button>
              <div className="mt-2 text-sm leading-5 text-[#555]">
                {profile.role}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.12em] text-[#7d7d7d]">
                {profile.location}
              </div>
            </div>

            <div className="border-t border-[#c7c7c7] px-3 py-3">
              <div className="space-y-2 text-sm font-bold text-[#3b5998]">
                <button
                  type="button"
                  onClick={() => jumpToSection("about-education")}
                  className="block text-left hover:underline"
                >
                  Education
                </button>
                <button
                  type="button"
                  onClick={() => jumpToSection("about-languages")}
                  className="block text-left hover:underline"
                >
                  Languages
                </button>
                <button
                  type="button"
                  onClick={() => jumpToSection("about-skills")}
                  className="block text-left hover:underline"
                >
                  Skills
                </button>
                <button
                  type="button"
                  onClick={() => jumpToSection("about-contact")}
                  className="block text-left hover:underline"
                >
                  Contact
                </button>
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#b7b7b7] pb-2">
              <h2 className="text-[24px] font-bold text-[#3b5998]">
                News Feed
              </h2>
              <div className="text-xs text-[#666]">Top news | Most recent</div>
            </div>

            <FeedPost
              title={
                <>
                  <span className="font-extrabold text-[#3b5998]">
                    {profile.name}
                  </span>{" "}
                  <span className="text-black">posted an </span>
                  <span className="text-[#3b5998]">introduction</span>
                </>
              }
            >
              <p className="font-bold">{profile.tagline}</p>
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </FeedPost>

            <FeedPost
              id="about-education"
              title={
                <>
                  <span className="font-extrabold text-[#3b5998]">
                    {profile.name}
                  </span>{" "}
                  <span className="text-black">celebrated an </span>
                  <span className="text-[#3b5998]">academic milestone</span>
                </>
              }
            >
              <div className="space-y-3">
                {educationEntries.map((entry) => (
                  <div
                    key={`${entry.school}-${entry.degree}-${entry.duration}`}
                    className="border border-[#d4d4d4] bg-[#fafafa] p-3"
                  >
                    <div className="font-bold text-[#3b5998]">
                      {entry.school}
                    </div>
                    <div>{entry.degree}</div>
                    <div className="text-sm text-[#666]">{entry.duration}</div>
                  </div>
                ))}
              </div>
            </FeedPost>

            <FeedPost
              id="about-languages"
              title={
                <>
                  <span className="font-extrabold text-[#3b5998]">
                    {profile.name}
                  </span>{" "}
                  <span className="text-black">acquired </span>
                  <span className="text-[#3b5998]">new skills</span>
                </>
              }
            >
              <p>i know duolingo hates to see me coming..</p>
              <div className="flex flex-wrap gap-2">
                {profile.language_skills.languages.map((language) => (
                  <span
                    key={language}
                    className="border border-[#aab6d3] bg-[#eef2fb] px-3 py-1 text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </FeedPost>

            {Object.entries(profile.skills).map(([group, values], index) => (
              <FeedPost
                key={group}
                id={index === 0 ? "about-skills" : undefined}
                title={
                  <>
                    <span className="font-extrabold text-[#3b5998]">
                      {profile.name}
                    </span>{" "}
                    <span className="text-black">acquired </span>
                    <span className="text-[#3b5998]">new skills</span>
                  </>
                }
              >
                <div className="mb-2 font-bold text-[#3b5998]">
                  {toPanelTitle(group)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => (
                    <span
                      key={value}
                      className="border border-[#d4d4d4] bg-white px-3 py-1 text-sm"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </FeedPost>
            ))}

            <FeedPost
              id="about-contact"
              title={
                <>
                  <span className="font-extrabold text-[#3b5998]">
                    {profile.name}
                  </span>{" "}
                  <span className="text-black">
                    updated contact information
                  </span>
                </>
              }
            >
              <div className="space-y-2">
                {Object.entries(profile.contact).map(([label, value]) => (
                  <div
                    key={label}
                    className="border border-[#d4d4d4] bg-white px-3 py-2"
                  >
                    <span className="mr-2 font-bold text-[#3b5998]">
                      {label}:
                    </span>
                    <span className="break-all">{value}</span>
                  </div>
                ))}
              </div>
            </FeedPost>
          </section>
        </div>
      )}
    </div>
  );
}

function ProfilePage({
  educationEntries,
  onBack,
}: {
  educationEntries: Array<{ school: string; degree: string; duration: string }>;
  onBack: () => void;
}) {
  return (
    <section className="grid gap-3 lg:grid-cols-[210px_1fr]">
      <div className="space-y-3">
        <ProfileBox title="Picture">
          <img
            src="/about-profile.png"
            alt="Tony Lee"
            draggable={false}
            className="mx-auto block h-[145px] w-[145px] select-none border border-[#b7b7b7] object-cover"
          />
        </ProfileBox>

        <a
          href={`mailto:${profile.contact.email}`}
          className="block w-full border border-[#a9a9a9] bg-white px-3 py-2 text-left text-sm shadow-[inset_-1px_-1px_0_#b7b7b7,inset_1px_1px_0_#ffffff]"
        >
          Send Tony a Message
        </a>
        <button
          type="button"
          onClick={onBack}
          className="w-full border border-[#a9a9a9] bg-white px-3 py-2 text-left text-sm shadow-[inset_-1px_-1px_0_#b7b7b7,inset_1px_1px_0_#ffffff]"
        >
          Back to News Feed
        </button>

        <ProfileBox title="Connection">
          Open to software engineering opportunities.
        </ProfileBox>

        <ProfileBox title="Mutual Friends">
          You and distributed systems have a lot in common.
        </ProfileBox>

        <ProfileBox title="Access">
          Currently based in {profile.location} and building systems with a soft
          spot for infrastructure.
        </ProfileBox>

        <ProfileBox title="Friends at">
          <div className="grid grid-cols-3 gap-2">
            {profile.language_skills.languages.slice(0, 3).map((item) => (
              <div
                key={item}
                className="flex aspect-square items-center justify-center border border-[#b7b7b7] bg-[#f4f4f4] px-1 text-center text-[11px] font-bold text-[#3b5998]"
              >
                {item}
              </div>
            ))}
          </div>
        </ProfileBox>
      </div>

      <ProfileBox title="Information" className="h-full">
        <div className="space-y-5 text-sm">
          <div>
            <div className="mb-2 font-bold">Account Info:</div>
            <ProfileRow label="Name:" value={profile.name} />
            <ProfileRow label="Member Since:" value="Recent grad era" />
            <ProfileRow label="Last Update:" value="July 24, 2026" />
          </div>

          <div>
            <div className="mb-2 font-bold">Basic Info:</div>
            <ProfileRow label="Role:" value={profile.role} />
            <ProfileRow label="Residence:" value={profile.location} />
            <ProfileRow
              label="Languages:"
              value={profile.language_skills.languages.join(", ")}
            />
          </div>

          <div>
            <div className="mb-2 font-bold">Education:</div>
            {educationEntries.map((entry) => (
              <div key={`${entry.school}-${entry.duration}`} className="mb-3">
                <ProfileRow label="School:" value={entry.school} />
                <ProfileRow label="Degree:" value={entry.degree} />
                <ProfileRow label="Years:" value={entry.duration} />
              </div>
            ))}
          </div>

          <div>
            <div className="mb-2 font-bold">Contact Info:</div>
            {Object.entries(profile.contact).map(([label, value]) => (
              <ProfileRow
                key={label}
                label={`${toPanelTitle(label)}:`}
                value={value}
              />
            ))}
          </div>

          <div>
            <div className="mb-2 font-bold">Personal Info:</div>
            <ProfileRow
              label="Interests:"
              value="Infrastructure, distributed systems, music playlists, and art"
            />
            <ProfileRow
              label="Skills:"
              value={Object.values(profile.skills).flat().join(", ")}
            />
          </div>
        </div>
      </ProfileBox>
    </section>
  );
}

function FeedPost({
  id,
  title,
  children,
}: {
  id?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article id={id} className="border border-[#d8d8d8] bg-white p-3">
      <div className="grid gap-3 sm:grid-cols-[56px_1fr] sm:items-start">
        <img
          src="/about-profile.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="h-14 w-14 select-none border border-[#b7b7b7] object-cover"
        />
        <div className="min-w-0">
          <div className="mb-3 font-bold">{title}</div>
          <div className="space-y-3 text-sm leading-6 text-black">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProfileBox({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`border border-[#7f93bc] bg-white ${className}`.trim()}>
      <div className="bg-[#3b5998] px-3 py-1 text-sm font-bold text-white">
        {title}
      </div>
      <div className="p-3 text-sm leading-5">{children}</div>
    </section>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-2">
      <div className="font-bold">{label}</div>
      <div className="break-words">{value}</div>
    </div>
  );
}

function toPanelTitle(value: string) {
  if (value === value.toUpperCase()) {
    return value;
  }

  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toEducationEntries(
  education:
    | { school: string; degree: string; duration: string }
    | Array<{ school: string; degree: string; duration: string }>,
) {
  return Array.isArray(education) ? education : [education];
}
