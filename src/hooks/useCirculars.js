import { useState, useMemo } from 'react';
import { useMockData } from '../context/useMockData';

export const useCirculars = () => {
  const mockData = useMockData();
  const {
    circulars,
    scamReports,
    organizations,
    addScannedCircular,
    submitScamReport,
    deleteCircular,
    deleteReport,
    updateReportStatus,
  } = mockData;

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); // all, verified, suspicious, unverified
  const [selectedSector, setSelectedSector] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, highest_risk, lowest_risk

  // Filtered & Sorted Circulars
  const filteredCirculars = useMemo(() => {
    return circulars
      .filter((item) => {
        const matchesQuery =
          !searchQuery ||
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sector?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          selectedStatus === 'all' || item.status === selectedStatus;

        const matchesSector =
          selectedSector === 'all' || item.sector === selectedSector;

        return matchesQuery && matchesStatus && matchesSector;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
        }
        if (sortBy === 'highest_risk') {
          return (b.riskScore || 0) - (a.riskScore || 0);
        }
        if (sortBy === 'lowest_risk') {
          return (a.riskScore || 0) - (b.riskScore || 0);
        }
        return 0;
      });
  }, [circulars, searchQuery, selectedStatus, selectedSector, sortBy]);

  return {
    circulars,
    filteredCirculars,
    scamReports,
    organizations,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedSector,
    setSelectedSector,
    sortBy,
    setSortBy,
    addScannedCircular,
    submitScamReport,
    deleteCircular,
    deleteReport,
    updateReportStatus,
    mockData,
  };
};

export default useCirculars;
