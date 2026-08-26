import { useState } from 'react';

interface Traits {
  openness: number;
  conscientiousness: number;
  extroversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface ConfigFormData {
  name: string;
  profession: string;
  relationship: string;
  tone: string;
  traits: Traits;
}

interface ConfigFormProps {
  initialData?: ConfigFormData;
  onSubmit: (data: ConfigFormData) => void;
  loading: boolean;
}

export default function ConfigForm({ initialData, onSubmit, loading }: ConfigFormProps) {
  const [name, setName] = useState(initialData?.name || 'Alex');
  const [profession, setProfession] = useState(initialData?.profession || 'Software Architect');
  const [relationship, setRelationship] = useState(initialData?.relationship || 'Friend');
  const [tone, setTone] = useState(initialData?.tone || 'casual');

  const [traits, setTraits] = useState<Traits>({
    openness: initialData?.traits?.openness ?? 50,
    conscientiousness: initialData?.traits?.conscientiousness ?? 50,
    extroversion: initialData?.traits?.extroversion ?? 50,
    agreeableness: initialData?.traits?.agreeableness ?? 50,
    neuroticism: initialData?.traits?.neuroticism ?? 50,
  });

  const handleSliderChange = (key: keyof Traits, value: number) => {
    setTraits((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      profession,
      relationship,
      tone,
      traits,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto bg-[#161715] p-6 md:p-8 rounded-3xl">
      {/* Persona Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#F5F5F0] font-heading pb-2">Identity Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#9CA39A] uppercase tracking-wider mb-1.5" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8F02D] text-[#F5F5F0] bg-[#0A0B0A] text-sm transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9CA39A] uppercase tracking-wider mb-1.5" htmlFor="profession">
              Profession
            </label>
            <input
              id="profession"
              type="text"
              required
              className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8F02D] text-[#F5F5F0] bg-[#0A0B0A] text-sm transition-all"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. Software Architect"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#9CA39A] uppercase tracking-wider mb-1.5" htmlFor="relationship">
              Relationship
            </label>
            <input
              id="relationship"
              type="text"
              required
              className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8F02D] text-[#F5F5F0] bg-[#0A0B0A] text-sm transition-all"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Friend, Advisor"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9CA39A] uppercase tracking-wider mb-1.5" htmlFor="tone">
              Speaking Tone
            </label>
            <input
              id="tone"
              type="text"
              required
              className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8F02D] text-[#F5F5F0] bg-[#0A0B0A] text-sm transition-all"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g. casual, formal"
            />
          </div>
        </div>
      </div>

      {/* Personality Sliders */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#F5F5F0] font-heading pb-2">Personality Profile (Big Five)</h3>
        
        <div className="space-y-4">
          {(Object.keys(traits) as Array<keyof Traits>).map((trait) => (
            <div key={trait} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="capitalize text-[#F5F5F0]">
                  {trait === 'extroversion' ? 'Extroversion' : trait}
                </span>
                <span className="text-[#C8F02D]">{traits[trait]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-1.5 bg-[#0A0B0A] rounded-full appearance-none cursor-pointer accent-[#C8F02D]"
                value={traits[trait]}
                onChange={(e) => handleSliderChange(trait, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3.5 px-6 text-sm group disabled:opacity-50"
      >
        <span>{loading ? 'Saving configuration...' : 'Continue to Voice Wizard'}</span>
        <span className="ml-1.5 transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
      </button>
    </form>
  );
}



