import { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Clock,
  RotateCcw,
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input, { Select, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '../../components/ui/Table';
import { formatDate } from '../../utils/formatters';
import { SAFETY_CATEGORIES, SAFETY_ARTICLES } from '../../data/safetyArticles';
import { useMockData } from '../../context/useMockData';

export const AdminSafetyTipsManagement = () => {
  const {
    safetyArticles: storeArticles,
    addSafetyArticle,
    updateSafetyArticle,
    deleteSafetyArticle,
    toggleArticlePublish,
  } = useMockData();
  const articles = storeArticles || SAFETY_ARTICLES;

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeLang, setActiveLang] = useState('en');
  const [actionToast, setActionToast] = useState('');

  // Create Article Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newArticleData, setNewArticleData] = useState({
    categoryId: 'job-scam-awareness',
    titleEn: '',
    titleBn: '',
    shortDescEn: '',
    shortDescBn: '',
    readingTime: '4 min read',
    fullContentEn: '',
    fullContentBn: '',
    isPublished: true,
  });

  // Edit Article Modal
  const [editingArticle, setEditingArticle] = useState(null);

  // Delete Confirmation Modal
  const [articleToDelete, setArticleToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filter logic
  const filteredArticles = articles.filter((art) => {
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      art.en.title.toLowerCase().includes(q) ||
      art.bn.title.toLowerCase().includes(q) ||
      art.categoryName.en.toLowerCase().includes(q) ||
      art.id.toLowerCase().includes(q);

    const matchCategory =
      categoryFilter === 'all' || art.categoryId === categoryFilter;

    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length);
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Publish / Unpublish Toggle
  const handleTogglePublish = (articleId) => {
    if (toggleArticlePublish) {
      toggleArticlePublish(articleId);
    }
    const target = articles.find((a) => a.id === articleId);
    const nextState = target ? !target.isPublished : true;
    setActionToast(
      `Article "${target?.en?.title || 'Article'}" is now ${nextState ? 'PUBLISHED' : 'UNPUBLISHED (DRAFT)'}.`
    );
    setTimeout(() => setActionToast(''), 4000);
  };

  // Create Article Handler
  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newArticleData.titleEn.trim()) return;

    if (addSafetyArticle) {
      addSafetyArticle(newArticleData);
    }
    setIsCreateModalOpen(false);
    setNewArticleData({
      categoryId: 'job-scam-awareness',
      titleEn: '',
      titleBn: '',
      shortDescEn: '',
      shortDescBn: '',
      readingTime: '4 min read',
      fullContentEn: '',
      fullContentBn: '',
      isPublished: true,
    });
    setActionToast(`Article "${newArticleData.titleEn}" published successfully.`);
    setTimeout(() => setActionToast(''), 4000);
  };

  // Edit Article Handler
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingArticle) return;

    if (updateSafetyArticle) {
      updateSafetyArticle(editingArticle.id, editingArticle);
    }
    setActionToast(`Article "${editingArticle.en.title}" updated.`);
    setEditingArticle(null);
    setTimeout(() => setActionToast(''), 4000);
  };

  // Delete Article Handler
  const handleConfirmDelete = () => {
    if (!articleToDelete) return;
    const title = articleToDelete.en.title;
    if (deleteSafetyArticle) {
      deleteSafetyArticle(articleToDelete.id);
    }
    setActionToast(`Article "${title}" has been deleted.`);
    setArticleToDelete(null);
    setTimeout(() => setActionToast(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Safety Content' },
        ]}
        title="Safety Tips Management"
        subtitle="Create, edit, publish, or unpublish candidate awareness articles in English and Bangla."
        actions={
          <div className="flex items-center gap-3">
            {/* Language preview toggle */}
            <div className="inline-flex p-1 bg-white rounded-xl border border-[#E2E8EC]">
              <button
                type="button"
                onClick={() => setActiveLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeLang === 'en' ? 'bg-[#102C3A] text-white shadow-xs' : 'text-[#64748B]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeLang === 'bn' ? 'bg-[#087F70] text-white shadow-xs' : 'text-[#64748B]'
                }`}
              >
                বাংলা
              </button>
            </div>

            <Button
              variant="secondary"
              size="md"
              leftIcon={Plus}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create New Article
            </Button>
          </div>
        }
      />

      {/* Action Notification Toast */}
      {actionToast && (
        <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A] animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionToast}</span>
          </div>
          <button onClick={() => setActionToast('')} className="p-1 hover:bg-[#D1FAE5] rounded cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search and Category Filters */}
      <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <Input
              placeholder="Search guides by title, category, or keyword..."
              leftIcon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              clearable
            />
          </div>
          <div className="sm:col-span-4">
            <Select
              options={SAFETY_CATEGORIES.map((c) => ({
                value: c.id,
                label: c[activeLang] || c.en,
              }))}
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
        <span>
          Showing <strong className="text-[#102C3A]">{filteredArticles.length}</strong> of{' '}
          <strong className="text-[#102C3A]">{articles.length}</strong> educational guides
        </span>
        {(searchQuery || categoryFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setCurrentPage(1);
            }}
            className="text-[#087F70] hover:underline cursor-pointer flex items-center gap-1 font-medium"
          >
            <RotateCcw size={12} />
            Reset Filters
          </button>
        )}
      </div>

      {/* Articles Table (Desktop) & Stacked Cards (Mobile) */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Desktop / Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article Title & Summary</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reading Time</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <EmptyState
                      icon={BookOpen}
                      title="No articles match your search"
                      description="Try searching with a different term or resetting category filters."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('all');
                            setCurrentPage(1);
                          }}
                        >
                          Clear Filters
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedArticles.map((art) => {
                  const content = art[activeLang] || art.en;
                  return (
                    <TableRow key={art.id} className="group">
                      {/* Title & Summary */}
                      <TableCell>
                        <div className="space-y-0.5 max-w-md">
                          <p className="font-bold text-xs sm:text-sm text-[#102C3A] group-hover:text-[#087F70] transition-colors line-clamp-1">
                            {content.title}
                          </p>
                          <p className="text-[11px] text-[#64748B] line-clamp-1">
                            {content.shortDescription}
                          </p>
                          <span className="font-mono text-[10px] text-[#087F70] font-semibold">
                            {art.id}
                          </span>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="default" size="sm">
                          {art.categoryName[activeLang]}
                        </Badge>
                      </TableCell>

                      {/* Reading Time */}
                      <TableCell>
                        <span className="text-xs text-[#64748B] flex items-center gap-1">
                          <Clock size={11} />
                          {art.readingTime[activeLang]}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <span className="text-xs text-[#102C3A]">
                          {formatDate(art.date)}
                        </span>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        {art.isPublished ? (
                          <Badge variant="verified" size="sm" showDot>
                            PUBLISHED
                          </Badge>
                        ) : (
                          <Badge variant="unverified" size="sm" showDot>
                            UNPUBLISHED / DRAFT
                          </Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Publish / Unpublish Toggle */}
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              art.isPublished
                                ? 'text-[#D99A28] hover:bg-[#FFFBEB]'
                                : 'text-[#16A36A] hover:bg-[#ECFDF5]'
                            }
                            onClick={() => handleTogglePublish(art.id)}
                          >
                            {art.isPublished ? 'Unpublish' : 'Publish'}
                          </Button>

                          {/* Edit Article */}
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={Edit}
                            onClick={() => setEditingArticle(art)}
                          >
                            Edit
                          </Button>

                          {/* View Live */}
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={Eye}
                            onClick={() => window.open(`/alerts/${art.id}`, '_blank')}
                          >
                            Live
                          </Button>

                          {/* Delete Article */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#DC4B4B] hover:bg-[#FEF2F2]"
                            leftIcon={Trash2}
                            onClick={() => setArticleToDelete(art)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked Cards (Zero Horizontal Scroll) */}
        <div className="sm:hidden divide-y divide-[#F1F5F8]">
          {filteredArticles.length === 0 ? (
            <div className="p-6 text-center">
              <EmptyState
                icon={BookOpen}
                title="No articles match your search"
                description="Try searching with a different term or resetting category filters."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                }
              />
            </div>
          ) : (
            paginatedArticles.map((art) => {
              const content = art[activeLang] || art.en;
              return (
                <div key={art.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="font-mono text-[10px] text-[#087F70] bg-[#087F70]/10 px-2 py-0.5 rounded font-bold">
                        {art.id}
                      </span>
                      <h4 className="font-bold text-sm text-[#102C3A] line-clamp-1 pt-1">
                        {content.title}
                      </h4>
                      <p className="text-xs text-[#64748B] line-clamp-2">
                        {content.shortDescription}
                      </p>
                    </div>
                    <Badge
                      variant={art.isPublished ? 'verified' : 'unverified'}
                      size="sm"
                      showDot
                    >
                      {art.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC] text-[#64748B]">
                    <span>{art.categoryName[activeLang]} • {art.readingTime[activeLang]}</span>
                    <span>{formatDate(art.date)}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 justify-center text-xs h-8.5 font-semibold min-w-[90px] ${
                        art.isPublished
                          ? 'text-[#D99A28] hover:bg-[#FFFBEB]'
                          : 'text-[#16A36A] hover:bg-[#ECFDF5]'
                      }`}
                      onClick={() => handleTogglePublish(art.id)}
                    >
                      {art.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={Edit}
                      onClick={() => setEditingArticle(art)}
                      className="flex-1 justify-center text-xs h-8.5 font-semibold min-w-[75px]"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={Eye}
                      onClick={() => window.open(`/alerts/${art.id}`, '_blank')}
                      className="text-xs h-8.5 px-3"
                    >
                      Live
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8.5 px-3 text-[#DC4B4B] hover:bg-[#FEF2F2]"
                      leftIcon={Trash2}
                      onClick={() => setArticleToDelete(art)}
                      title="Delete Article"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Table Pagination Footer */}
        {filteredArticles.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <div className="text-xs text-[#64748B]">
              Showing <span className="font-semibold text-[#102C3A]">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-[#102C3A]">{endIndex}</span> of{' '}
              <span className="font-semibold text-[#102C3A]">{filteredArticles.length}</span> guides
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-8 px-2.5 text-xs"
              >
                <ChevronLeft size={14} className="mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#102C3A] text-white shadow-xs'
                        : 'bg-white text-[#64748B] hover:bg-[#F1F5F8] border border-[#E2E8F0]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 px-2.5 text-xs"
              >
                Next
                <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* CREATE ARTICLE MODAL */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Educational Safety Article"
          description="Author educational content to educate candidates against recruitment fraud syndicates."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCreateArticle}
              >
                Publish Article
              </Button>
            </div>
          }
        >
          <form onSubmit={handleCreateArticle} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Content Category (Mandatory)"
                options={SAFETY_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
                  value: c.id,
                  label: c.en,
                }))}
                value={newArticleData.categoryId}
                onChange={(e) =>
                  setNewArticleData({ ...newArticleData, categoryId: e.target.value })
                }
              />
              <Input
                label="Estimated Reading Time"
                placeholder="e.g. 5 min read"
                value={newArticleData.readingTime}
                onChange={(e) =>
                  setNewArticleData({ ...newArticleData, readingTime: e.target.value })
                }
              />
            </div>

            {/* Bilingual Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Title (English)"
                placeholder="e.g. How to Spot Telegram Task Scams"
                value={newArticleData.titleEn}
                onChange={(e) =>
                  setNewArticleData({ ...newArticleData, titleEn: e.target.value })
                }
                required
              />
              <Input
                label="Title (Bangla - বাংলা)"
                placeholder="e.g. টেলিগ্রাম টাস্ক প্রতারণা চেনার সহজ উপায়"
                value={newArticleData.titleBn}
                onChange={(e) =>
                  setNewArticleData({ ...newArticleData, titleBn: e.target.value })
                }
              />
            </div>

            {/* Bilingual Short Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Short Summary (English)"
                rows={2}
                placeholder="Brief excerpt displayed on article preview cards..."
                value={newArticleData.shortDescEn}
                onChange={(e) =>
                  setNewArticleData({ ...newArticleData, shortDescEn: e.target.value })
                }
              />
              <Textarea
                label="Short Summary (Bangla - বাংলা)"
                rows={2}
                placeholder="আর্টিকেল কার্ডের সংক্ষিপ্ত বিবরণ..."
                value={newArticleData.shortDescBn}
                onChange={(e) =>
                  setNewArticleData({ ...newArticleData, shortDescBn: e.target.value })
                }
              />
            </div>

            {/* Full Body Content */}
            <Textarea
              label="Full Article Content (English)"
              rows={4}
              placeholder="Detailed guidelines, red flag breakdowns, and prevention checklists..."
              value={newArticleData.fullContentEn}
              onChange={(e) =>
                setNewArticleData({ ...newArticleData, fullContentEn: e.target.value })
              }
            />

            <Textarea
              label="Full Article Content (Bangla - বাংলা)"
              rows={4}
              placeholder="বিস্তারিত দিকনির্দেশনা ও করণীয়..."
              value={newArticleData.fullContentBn}
              onChange={(e) =>
                setNewArticleData({ ...newArticleData, fullContentBn: e.target.value })
              }
            />
          </form>
        </Modal>
      )}

      {/* EDIT ARTICLE MODAL */}
      {editingArticle && (
        <Modal
          isOpen={!!editingArticle}
          onClose={() => setEditingArticle(null)}
          title={`Edit Article: ${editingArticle.en.title}`}
          description={`ID: ${editingArticle.id}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingArticle(null)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Title (English)"
                value={editingArticle.en.title}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    en: { ...editingArticle.en, title: e.target.value },
                  })
                }
                required
              />
              <Input
                label="Title (Bangla - বাংলা)"
                value={editingArticle.bn.title}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    bn: { ...editingArticle.bn, title: e.target.value },
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Short Description (English)"
                rows={2}
                value={editingArticle.en.shortDescription}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    en: { ...editingArticle.en, shortDescription: e.target.value },
                  })
                }
              />
              <Textarea
                label="Short Description (Bangla - বাংলা)"
                rows={2}
                value={editingArticle.bn.shortDescription}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    bn: { ...editingArticle.bn, shortDescription: e.target.value },
                  })
                }
              />
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {articleToDelete && (
        <Modal
          isOpen={!!articleToDelete}
          onClose={() => setArticleToDelete(null)}
          title="Delete Educational Article"
          description={`Are you sure you want to permanently delete "${articleToDelete.en.title}"?`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setArticleToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Delete Article
              </Button>
            </div>
          }
        >
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-xs">
            <AlertTriangle size={20} className="text-[#DC4B4B] shrink-0 mt-0.5" />
            <p className="text-[#64748B] leading-relaxed">
              This will permanently delete this educational guide from both English and Bangla public views.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSafetyTipsManagement;
