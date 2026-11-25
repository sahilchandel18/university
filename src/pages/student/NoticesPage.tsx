import React, { useState, useMemo } from 'react';
import { Bell, Pin } from 'lucide-react';
import { getNotices } from '../../lib/database';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn, formatDate } from '../../lib/utils';

const CATEGORIES = ['All', 'Academic', 'Examination', 'Hostel', 'Accounts', 'General'] as const;

export function NoticesPage() {
  const notices = useMemo(() => getNotices(), []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = notices.filter(n => {
    const matchCat = category === 'All' || n.category === category;
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">University Notices &amp; Circulars</h1>
        <p className="text-sm text-muted-foreground mt-1">Official announcements from DAV University.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search notices..."
          className="sm:w-72"
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                category === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bell className="h-8 w-8 text-muted-foreground" />}
            title="No Notices Found"
            description="Try adjusting your search or category filter."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((notice) => (
            <Card key={notice.id} className={notice.important ? 'border-primary-300 dark:border-primary-800' : ''}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                      {notice.category}
                    </span>
                    {notice.important && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                        <Pin className="h-3 w-3" /> Important
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{notice.title}</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(notice.date)}</span>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground leading-relaxed">{notice.content}</p>
                <p className="text-xs font-medium text-foreground pt-2">Issued by: {notice.issuedBy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
