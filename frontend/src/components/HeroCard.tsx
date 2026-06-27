import { useState, useRef, useEffect } from 'react';
import { Hero } from '../types/hero';

interface Props {
  hero: Hero;
  onView: (hero: Hero) => void;
  onEdit: (hero: Hero) => void;
  onDelete: (hero: Hero) => void;
  onActivate: (hero: Hero) => void;
}

export function HeroCard({ hero, onView, onEdit, onDelete, onActivate }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`hero-card${hero.is_active ? '' : ' inactive'}`} onClick={() => onView(hero)}>
      <img
        src={hero.avatar_url}
        alt={hero.nickname}
        onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200'; }}
      />
      <span className={`hero-card-badge ${hero.is_active ? 'badge-active' : 'badge-inactive'}`}>
        {hero.is_active ? 'Ativo' : 'Inativo'}
      </span>

      <div className="hero-actions" ref={ref} onClick={e => e.stopPropagation()}>
        <button className="actions-btn" onClick={() => setOpen(o => !o)}>⋮</button>
        {open && (
          <div className="actions-dropdown">
            {hero.is_active ? (
              <>
                <button onClick={() => { setOpen(false); onEdit(hero); }}>✏️ Editar</button>
                <button className="danger" onClick={() => { setOpen(false); onDelete(hero); }}>🗑️ Excluir</button>
              </>
            ) : (
              <button className="success" onClick={() => { setOpen(false); onActivate(hero); }}>✅ Ativar</button>
            )}
          </div>
        )}
      </div>

      <div className="hero-card-body">
        <h3>{hero.nickname}</h3>
        <p>{hero.name}</p>
        <p style={{ fontSize: '0.7rem', marginTop: '0.2rem', color: '#6666aa' }}>{hero.universe}</p>
      </div>
    </div>
  );
}
