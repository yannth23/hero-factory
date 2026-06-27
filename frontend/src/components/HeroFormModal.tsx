import { useState, useEffect } from 'react';
import { Hero, CreateHeroDTO } from '../types/hero';

interface Props {
  hero?: Hero | null;
  onClose: () => void;
  onSubmit: (data: CreateHeroDTO) => Promise<void>;
  loading?: boolean;
}

const UNIVERSES = ['Marvel', 'DC', 'Dark Horse', 'Image Comics', 'Indie', 'Outro'];

export function HeroFormModal({ hero, onClose, onSubmit, loading }: Props) {
  const [form, setForm] = useState<CreateHeroDTO>({
    name: '', nickname: '', date_of_birth: '', universe: 'Marvel', main_power: '', avatar_url: '',
  });

  useEffect(() => {
    if (hero) {
      const dob = hero.date_of_birth ? hero.date_of_birth.split(' ')[0] : '';
      setForm({ name: hero.name, nickname: hero.nickname, date_of_birth: dob,
        universe: hero.universe, main_power: hero.main_power, avatar_url: hero.avatar_url });
    }
  }, [hero]);

  const set = (key: keyof CreateHeroDTO) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{hero ? 'Editar Herói' : 'Criar Herói'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Nome completo *</label>
            <input value={form.name} onChange={set('name')} required placeholder="Ex: Robert Bruce Banner" />
          </div>
          <div className="field"><label>Nome de guerra *</label>
            <input value={form.nickname} onChange={set('nickname')} required placeholder="Ex: Hulk" />
          </div>
          <div className="field"><label>Data de nascimento *</label>
            <input type="date" value={form.date_of_birth} onChange={set('date_of_birth')} required />
          </div>
          <div className="field"><label>Universo *</label>
            <select value={form.universe} onChange={set('universe')}>
              {UNIVERSES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="field"><label>Habilidade principal *</label>
            <input value={form.main_power} onChange={set('main_power')} required placeholder="Ex: Super força" />
          </div>
          <div className="field"><label>URL do avatar *</label>
            <input type="url" value={form.avatar_url} onChange={set('avatar_url')} required placeholder="https://..." />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" style={{width:16,height:16,borderWidth:2}}></span> Salvando...</> : (hero ? 'Salvar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
