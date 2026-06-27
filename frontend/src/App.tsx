import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { heroesApi } from './api/heroes';
import { Hero, CreateHeroDTO } from './types/hero';
import { HeroCard } from './components/HeroCard';
import { HeroDetailModal } from './components/HeroDetailModal';
import { HeroFormModal } from './components/HeroFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Pagination } from './components/Pagination';

type Modal = 'create' | 'edit' | 'delete' | 'activate' | 'view' | null;

export default function App() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState<Hero | null>(null);
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useQuery(
    ['heroes', page, debouncedSearch],
    () => heroesApi.list({ page, limit: 10, search: debouncedSearch }),
    { keepPreviousData: true }
  );

  const invalidate = () => qc.invalidateQueries('heroes');

  const createMutation = useMutation(heroesApi.create, {
    onSuccess: () => { toast.success('Herói criado com sucesso!'); setModal(null); invalidate(); },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro ao criar herói'),
  });

  const updateMutation = useMutation(
    (vars: { id: string; data: CreateHeroDTO }) => heroesApi.update(vars.id, vars.data),
    {
      onSuccess: () => { toast.success('Herói atualizado!'); setModal(null); invalidate(); },
      onError: (e: any) => toast.error(e.response?.data?.error || 'Erro ao atualizar herói'),
    }
  );

  const deleteMutation = useMutation(heroesApi.delete, {
    onSuccess: () => { toast.success('Herói excluído.'); setModal(null); invalidate(); },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro ao excluir herói'),
  });

  const activateMutation = useMutation(heroesApi.activate, {
    onSuccess: () => { toast.success('Herói ativado!'); setModal(null); invalidate(); },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro ao ativar herói'),
  });

  const handleSearch = useCallback((v: string) => {
    setSearch(v);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => { setDebouncedSearch(v); setPage(1); }, 400));
  }, [searchTimer]);

  const open = (m: Modal, h?: Hero) => { setSelected(h || null); setModal(m); };
  const close = () => { setModal(null); setSelected(null); };

  return (
    <div className="app">
      <header>
        <h1>⚡ Hero Factory</h1>
        <button className="btn btn-primary" onClick={() => open('create')}>+ Novo Herói</button>
      </header>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Buscar por nome ou nome de guerra..."
        />
      </div>

      {isLoading ? (
        <div className="loading-overlay"><div className="spinner" /></div>
      ) : !data?.data?.length ? (
        <div className="empty-state">
          <h3>Nenhum herói encontrado</h3>
          <p>Crie seu primeiro herói clicando no botão acima.</p>
        </div>
      ) : (
        <>
          <div className="heroes-grid">
            {data.data.map(hero => (
              <HeroCard
                key={hero.id}
                hero={hero}
                onView={h => open('view', h)}
                onEdit={h => open('edit', h)}
                onDelete={h => open('delete', h)}
                onActivate={h => open('activate', h)}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      {modal === 'view' && selected && (
        <HeroDetailModal hero={selected} onClose={close} />
      )}

      {(modal === 'create' || modal === 'edit') && (
        <HeroFormModal
          hero={modal === 'edit' ? selected : null}
          onClose={close}
          loading={createMutation.isLoading || updateMutation.isLoading}
          onSubmit={async (data) => {
            if (modal === 'edit' && selected) {
              await updateMutation.mutateAsync({ id: selected.id, data });
            } else {
              await createMutation.mutateAsync(data);
            }
          }}
        />
      )}

      {modal === 'delete' && selected && (
        <ConfirmModal
          title="Excluir Herói"
          message={`Tem certeza que deseja excluir "${selected.nickname}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          confirmClass="btn-danger"
          onClose={close}
          loading={deleteMutation.isLoading}
          onConfirm={async () => { await deleteMutation.mutateAsync(selected.id); }}
        />
      )}

      {modal === 'activate' && selected && (
        <ConfirmModal
          title="Ativar Herói"
          message={`Deseja reativar "${selected.nickname}"?`}
          confirmLabel="Ativar"
          confirmClass="btn-success"
          onClose={close}
          loading={activateMutation.isLoading}
          onConfirm={async () => { await activateMutation.mutateAsync(selected.id); }}
        />
      )}
    </div>
  );
}
