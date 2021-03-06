import React from "react";
import InvocationModel from "./invocation_model";

interface Props {
  model: InvocationModel;
}

export default class CacheCardComponent extends React.Component {
  props: Props;

  render() {
    return (
      <div className="card">
        <img className="icon" src="/image/cache.svg" />
        <div className="content">
          <div className="title">Cache stats</div>
          {!this.props.model.cacheStats.length ||
            (this.props.model.cacheStats.length &&
              +this.props.model.cacheStats[0]?.totalDownloadSizeBytes == 0 &&
              +this.props.model.cacheStats[0]?.totalUploadSizeBytes == 0 && (
                <div className="no-cache-stats">Cache stats only available when using BuildBuddy cache.</div>
              ))}
          {this.props.model.cacheStats.length && (
            <div className="details">
              {this.props.model.cacheStats.map((cacheStat) => {
                let downloadThroughput =
                  +cacheStat.totalDownloadSizeBytes / 1000000 / (+cacheStat.totalDownloadUsec / 1000000) || 0;
                let uploadThroughput =
                  +cacheStat.totalUploadSizeBytes / 1000000 / (+cacheStat.totalUploadUsec / 1000000) || 0;
                return (
                  <div className="cache-sections">
                    <div className="cache-section">
                      <div className="cache-title">Action cache (AC)</div>
                      <div className="cache-subtitle">Maps action hashes to action result metadata</div>
                      <div className="cache-chart">
                        {this.drawPieChart(
                          +cacheStat.actionCacheHits,
                          "#4CAF50",
                          +cacheStat.actionCacheMisses,
                          "#f44336"
                        )}
                        <div>
                          <div className="cache-chart-label">
                            <span className="color-swatch cache-hit-color-swatch"></span>
                            <span className="cache-stat">{cacheStat.actionCacheHits}</span> hits
                          </div>
                          <div className="cache-chart-label">
                            <span className="color-swatch cache-miss-color-swatch"></span>
                            <span className="cache-stat">{cacheStat.actionCacheMisses}</span> misses
                          </div>
                          <div className="cache-chart-label">
                            <span className="color-swatch"></span>
                            <span className="cache-stat">{cacheStat.actionCacheUploads}</span> writes
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="cache-section">
                      <div className="cache-title">Content addressable store (CAS)</div>
                      <div className="cache-subtitle">Stores files (including logs & profiling info)</div>
                      <div className="cache-chart">
                        {this.drawPieChart(+cacheStat.casCacheHits, "#4CAF50", +cacheStat.casCacheMisses, "#f44336")}
                        <div>
                          <div className="cache-chart-label">
                            <span className="color-swatch cache-hit-color-swatch"></span>
                            <span className="cache-stat">{cacheStat.casCacheHits}</span> hits
                          </div>
                          <div className="cache-chart-label">
                            <span className="color-swatch cache-miss-color-swatch"></span>
                            <span className="cache-stat">{cacheStat.casCacheMisses}</span> misses
                          </div>
                          <div className="cache-chart-label">
                            <span className="color-swatch"></span>
                            <span className="cache-stat">{cacheStat.casCacheUploads}</span> writes
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="cache-section">
                      <div className="cache-title">Volume</div>
                      <div className="cache-subtitle">Total size of files uploaded & downloaded from both caches</div>
                      <div className="cache-chart">
                        {this.drawPieChart(
                          +cacheStat.totalDownloadSizeBytes,
                          "#03A9F4",
                          +cacheStat.totalUploadSizeBytes,
                          "#607D8B"
                        )}
                        <div>
                          <div className="cache-chart-label">
                            <span className="color-swatch download-color-swatch"></span>
                            <span className="cache-stat">
                              {(+cacheStat.totalDownloadSizeBytes / 1000000).toFixed(2)}
                            </span>{" "}
                            MB downloaded
                          </div>
                          <div className="cache-chart-label">
                            <span className="color-swatch upload-color-swatch"></span>
                            <span className="cache-stat">
                              {(+cacheStat.totalUploadSizeBytes / 1000000).toFixed(2)}
                            </span>{" "}
                            MB upload
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="cache-section">
                      <div className="cache-title">Throughput</div>
                      <div className="cache-subtitle">Upload / download speed (per parallelized cache request)</div>
                      <div className="cache-chart">
                        {this.drawPieChart(downloadThroughput, "#03A9F4", uploadThroughput, "#607D8B")}
                        <div>
                          <div className="cache-chart-label">
                            <span className="color-swatch download-color-swatch"></span>
                            <span className="cache-stat">{downloadThroughput.toFixed(2)}</span> MB / sec download
                          </div>
                          <div className="cache-chart-label">
                            <span className="color-swatch upload-color-swatch"></span>
                            <span className="cache-stat">{uploadThroughput.toFixed(2)}</span> MB / sec upload
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  drawPieChart(a: number, colorA: string, b: number, colorB: string) {
    let total = a + b;
    let percentA = (100 * a) / total;
    let percentB = (100 * b) / total;
    if (a == 0 && b == 0) {
      colorA = "#eee";
      colorB = "#eee";
    }

    return (
      <div className="cache-chart-container">
        <svg viewBox="0 0 32 32" style={{ borderRadius: "50%", transform: "rotate(-90deg)" }}>
          <g strokeWidth="16">
            <circle
              fill="transparent"
              r="16"
              cx="16"
              cy="16"
              stroke={colorA}
              strokeDasharray={`${percentA} 100`}
              strokeDashoffset="0"
            />
            <circle
              fill="transparent"
              r="16"
              cx="16"
              cy="16"
              stroke={colorB}
              strokeDasharray={`${percentB} 100`}
              strokeDashoffset={`-${percentA}`}
            />
          </g>
        </svg>
      </div>
    );
  }
}
