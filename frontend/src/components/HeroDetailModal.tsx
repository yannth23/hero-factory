import { Hero } from '../types/hero';

interface Props { hero: Hero; onClose: () => void; }

export function HeroDetailModal({ hero, onClose }: Props) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Detalhes do Herói</h2>
        <div className="hero-detail">
          <img
            src={hero.avatar_url}
            alt={hero.nickname}
            onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200'; }}
          />
          <table>
            <tbody>
              <tr><td>Nome completo</td><td><strong>{hero.name}</strong></td></tr>
              <tr><td>Nome de guerra</td><td><strong>{hero.nickname}</strong></td></tr>
              <tr><td>Data de nascimento</td><td>{hero.date_of_birth}</td></tr>
              <tr><td>Universo</td><td>{hero.universe}</td></tr>
              <tr><td>Habilidade principal</td><td>{hero.main_power}</td></tr>
              <tr><td>Status</td><td>
                <span style={{ color: hero.is_active ? 'var(--success)' : 'var(--text-muted)', fontWeight: 700 }}>
                  {hero.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </td></tr>
              <tr><td>Criado em</td><td>{hero.created_at}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
