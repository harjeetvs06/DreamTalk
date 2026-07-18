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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-dream-rest">
      {/* Persona Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#111111] pb-3">Identity Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:shadow-dream-focus text-[#111111] bg-[#FAFAFA] text-sm transition-shadow"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1" htmlFor="profession">
              Profession
            </label>
            <input
              id="profession"
              type="text"
              required
              className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:shadow-dream-focus text-[#111111] bg-[#FAFAFA] text-sm transition-shadow"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. Software Architect"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1" htmlFor="relationship">
              Relationship
            </label>
            <input
              id="relationship"
              type="text"
              required
              className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:shadow-dream-focus text-[#111111] bg-[#FAFAFA] text-sm transition-shadow"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Friend, Advisor"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1" htmlFor="tone">
              Speaking Tone
            </label>
            <input
              id="tone"
              type="text"
              required
              className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:shadow-dream-focus text-[#111111] bg-[#FAFAFA] text-sm transition-shadow"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g. casual, formal"
            />
          </div>
        </div>
      </div>

      {/* Personality Sliders */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#111111] pb-3">Personality Profile (Big Five)</h3>
        
        <div className="space-y-4">
          {(Object.keys(traits) as Array<keyof Traits>).map((trait) => (
            <div key={trait} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="capitalize text-[#111111]">
                  {trait === 'extroversion' ? 'Extroversion' : trait}
                </span>
                <span className="text-[#2563EB]">{traits[trait]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
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
        className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 disabled:opacity-50"
      >
        {loading ? 'Saving configuration...' : 'Continue to Voice Wizard'}
      </button>
    </form>
  );
}
