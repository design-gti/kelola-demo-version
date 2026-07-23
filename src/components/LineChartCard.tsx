"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect, useState, useId, useCallback } from "react";
import type { ApexOptions } from "apexcharts";
import { Paper, Select, Text } from "@mantine/core";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LineChartCardProps {
  title: string;
  value: string;
  chipColor: string;
  data: number[];
  areaColor: string;
  lineColor: string;
  hideDeptFilter?: boolean;
}

export default function LineChartCard({ title, value, chipColor, data, areaColor, lineColor, hideDeptFilter }: LineChartCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartWrapRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(300);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const chartId = `chart${uid}`;
  const lastAnnotatedIdx = useRef<number>(-1);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setChartWidth(containerRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const years = ["2020", "2021", "2022", "2023", "2024"];
  const peakIndex = data.indexOf(Math.max(...data));

  const getChartInstance = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).Apex?._chartInstances?.find((c: any) => c.id === chartId)?.chart;
  }, [chartId]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const chart = getChartInstance();
    if (!chart) return;
    const g = chart.w.globals;

    // Find the SVG element inside our wrapper
    const svg = chartWrapRef.current?.querySelector("svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // Scale factor: SVG intrinsic units → CSS pixels
    const scaleX = rect.width / g.svgWidth;
    const scaleY = rect.height / g.svgHeight;

    // Mouse position in SVG units
    const svgX = (e.clientX - rect.left) / scaleX;
    const svgY = (e.clientY - rect.top) / scaleY;

    // Find nearest data point
    const yMin = g.minY ?? 0;
    const yMax = g.maxY ?? 5;
    const xValues: number[] = g.seriesXvalues?.[0] ?? [];
    const THRESHOLD = 15; // SVG units

    let nearest = -1;
    let minDist = Infinity;
    for (let i = 0; i < data.length; i++) {
      const dotX = g.translateX + (xValues[i] ?? 0);
      const dotY = g.translateY + g.gridHeight * (1 - (data[i] - yMin) / (yMax - yMin));
      const dist = Math.sqrt((svgX - dotX) ** 2 + (svgY - dotY) ** 2);
      if (dist < THRESHOLD && dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }

    if (nearest === lastAnnotatedIdx.current) return;
    lastAnnotatedIdx.current = nearest;

    if (nearest === -1) {
      chart.clearAnnotations();
      return;
    }

    chart.clearAnnotations();

    // Vertical dashed line
    chart.addXaxisAnnotation({
      x: years[nearest],
      strokeDashArray: 4,
      borderColor: chipColor,
      borderWidth: 1,
      opacity: 0.35,
      label: { text: "" },
    }, false);

    // Enlarged dot overlay
    chart.addPointAnnotation({
      x: years[nearest],
      y: data[nearest],
      marker: {
        size: 8,
        fillColor: chipColor,
        strokeColor: "#fff",
        strokeWidth: 2.5,
        cssClass: "",
      },
      label: { text: "" },
    }, false);

    // Tooltip chip
    chart.addPointAnnotation({
      x: years[nearest],
      y: data[nearest],
      marker: { size: 0 },
      label: {
        text: data[nearest].toFixed(2),
        borderColor: "transparent",
        offsetY: -8,
        style: {
          background: chipColor, color: "#fff",
          fontSize: "10px", fontWeight: 700,
          fontFamily: "'Open Sans', sans-serif",
          padding: { top: 2, bottom: 2, left: 8, right: 8 },
        },
      },
    }, false);
  }, [getChartInstance, data, years, chipColor]);

  const handleMouseLeave = useCallback(() => {
    if (lastAnnotatedIdx.current === -1) return;
    lastAnnotatedIdx.current = -1;
    getChartInstance()?.clearAnnotations();
  }, [getChartInstance]);

  const options: ApexOptions = {
    chart: {
      id: chartId,
      type: "area", toolbar: { show: false }, zoom: { enabled: false }, animations: { enabled: false },
    },
    stroke: { curve: "smooth", width: 2, colors: [lineColor] },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        colorStops: [
          { offset: 0,   color: areaColor, opacity: 0.4 },
          { offset: 100, color: areaColor, opacity: 0.05 },
        ],
      },
    },
    colors: [lineColor],
    xaxis: {
      categories: years,
      labels: { style: { fontSize: "10px", fontFamily: "'Open Sans', sans-serif", colors: "#495057" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0, max: 5, tickAmount: 5,
      labels: {
        style: { fontSize: "7px", fontFamily: "'Inter', sans-serif", colors: "#495057" },
        formatter: (v) => v.toFixed(0),
      },
    },
    grid: {
      borderColor: "#f0f0f0",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 0, right: 8, top: 10, bottom: 0 },
    },
    markers: {
      size: data.map((_, i) => (i === peakIndex ? 5 : 3)),
      colors: [lineColor],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { sizeOffset: 2 },
    },
    annotations: { points: [] },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
    legend: { show: false },
  };

  return (
    <Paper radius={12} p={16} w="100%"
      style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", minHeight: 280, display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="flex items-center justify-between gap-2">
        <Text c="#495057" size="sm" fw={700} style={{ flex: 1, fontFamily: "'Open Sans', sans-serif" }}>
          {title}
        </Text>
        {!hideDeptFilter && (
          <Select
            data={["All Department"]}
            defaultValue="All Department"
            radius="xl"
            size="xs"
            w={141}
            allowDeselect={false}
            comboboxProps={{ withinPortal: true }}
          />
        )}
      </div>

      <div ref={containerRef} className="flex-1 w-full">
        {chartWidth > 0 && (
          <div
            ref={chartWrapRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <ApexChart
              type="area"
              options={options}
              series={[{ name: title, data }]}
              height={210}
              width={chartWidth}
            />
          </div>
        )}
      </div>
    </Paper>
  );
}
