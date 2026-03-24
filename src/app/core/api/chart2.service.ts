import { Injectable } from '@angular/core';
import { Iproject } from '../interface/iproject';
import { ApexAxisChartSeries, ApexOptions } from 'ng-apexcharts';

@Injectable({
  providedIn: 'root'
})
export class Chart2Service {
  safeNumber(val: any) {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };
  constructor() { }
  allDateApex(project: Iproject): ApexOptions {

    const series: ApexAxisChartSeries = project.results?.map((r, i) => ({
      name: i === 0
        ? 'Before 3 Months'
        : `After ${i * 3} Months`,

      data: [
        Number(r.view ?? 0),
        Number(r.interaction ?? 0),
        Number(r.Click ?? 0),
        Number(r.visit_page ?? 0),
        Number(r.New_follower ?? 0)
      ]
    })) || [];

    return {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: true },
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 800
        }
      },

      series,

      xaxis: {
        categories: ['Views', 'Interaction', 'Click', 'Visit Page', 'New Followers']
      },

      yaxis: {
        title: { text: 'Count' }
      },

      colors: [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd'
      ],

      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          colors: ['#333']
        },
        offsetY: -20,
      },

      stroke: {
        show: true,
        width: 4
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '80%',
          borderRadius: 2,
          dataLabels: {
            position: 'top' // 👈 هنا الصح
          }
        }
      },

      fill: {
        opacity: 0.9
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}`
        }
      },
      legend: {
        position: 'left'
      }
    };
  }

  viewsDataApex(project: Iproject): ApexOptions {
    const results = project?.results ?? [];

    // 🏷️ Labels (Stages)
    const stages = results.map((_, i) =>
      i === 0
        ? 'Before 3 Months'
        : `After ${i * 3} Months`
    );

    // 🔢 Safe number function usage
    const dataSeries = results.map(r => this.safeNumber(r.view));

    // 🚨 حماية لو مفيش بيانات أو كلها صفر
    const hasData = dataSeries.some(v => v > 0);

    if (!hasData) {
      dataSeries.push(1);
      stages.push('No Data');
    }

    return {
      chart: {
        type: 'donut' as const,
        height: 350,
      },

      title: {
        text: 'Views Distribution by Stage',
        align: 'center',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333'
        }
      },

      series: dataSeries,
      labels: stages,

      colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#00bfff', '#ff6347', '#32cd32', '#ff4500', '#8a2be2'],
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 50, 100]
        }
      },

      dataLabels: {
        enabled: true,
        formatter: (_val: number, opts: any) => {
          // عرض القيمة الفعلية بدل النسبة
          return opts.w.globals.series[opts.seriesIndex];
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#333']
        }
      },

      legend: {
        position: 'top',
        formatter: (label: string, opts: any) =>
          `${label}: ${opts.w.globals.series[opts.seriesIndex]}`
      },

      tooltip: {
        y: {
          formatter: (val: number) => `${val} Views`
        }
      },

      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: { height: 400 },
            legend: { position: 'bottom' }
          }
        }
      ]
    };
  }

  interactionDataApex(project: Iproject): ApexOptions {
    const results = project?.results || [];
    const stages = results.map((_, i) =>
      i === 0 ? 'Before 3 Months' : `After ${i * 3} Months`
    );
    const seriesData = results.map(r => Number(r.interaction || 0));
    const colors = ['#00E396', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']

    return {
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 800
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
          dataLabels: {
            position: 'top' // تظهر القيم أعلى كل شريط
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toString(),
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: ['#fff']
        }
      },
      series: [{
        name: 'Interactions',
        data: seriesData
      }],
      xaxis: {
        categories: stages
      },
      colors: seriesData.map((_, i) => colors[i % colors.length]),
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          gradientToColors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
          shadeIntensity: 0.5,
          opacityFrom: 0.8,
          opacityTo: 0.9,
          stops: [0, 50, 100]
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => val.toString()
        }
      },
      title: {
        text: 'Interactions by Stage',
        align: 'left'
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { height: 300 },
            plotOptions: { bar: { horizontal: false } },
            legend: { position: 'bottom' }
          }
        }
      ]
    };
  }

  clickDataApex(project: Iproject): ApexOptions {

    const startDate = new Date(project.date_start);
    const results = project?.results ?? [];

    const seriesData = results.map((r, i) => {

      const date = new Date(startDate);
      date.setMonth(date.getMonth() + (i * 3)); // كل مرحلة +3 شهور

      return [
        date.getTime(),
        Number(r.Click ?? 0)
      ];
    });

    return {
      series: [{
        name: 'Clicks',
        data: seriesData
      }],

      chart: {
        type: 'area',
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },

      dataLabels: { enabled: false },

      markers: { size: 4 }, // نخلي النقاط تظهر

      title: {
        text: 'Click Growth Over Time',
        align: 'left'
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        }
      },

      stroke: {
        curve: 'smooth',
        width: 3
      },

      xaxis: {
        type: 'datetime'
      },

      yaxis: {
        title: {
          text: 'Clicks' ,
        }
      },

      tooltip: {
        y: {
          formatter: (val: number) => `${val} Clicks`
        }
      },

      colors: ['#1f77b4']
    };
  }


  vistDataApex(project: Iproject): ApexOptions {
    const results = project?.results ?? [];

    const stages = results.map((_, i) =>
      i === 0
        ? 'Before 3 Months'
        : `After ${i * 3} Months`
    );

    const rawData = results.map(r => this.safeNumber(r.visit_page));

    const total = rawData.reduce((a, b) => a + b, 0);

    const hasData = rawData.some(v => v > 0);

    if (!hasData) {
      rawData.push(1);
      stages.push('No Data');
    }

    // 🔥 cumulative
    let cumulative = 0;
    const data = rawData.map(val => {
      cumulative += val;
      return total ? Math.round((cumulative / total) * 100) : 0;
    });

    return {
      chart: {
        type: 'radialBar',
        height: 200,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1200,
          animateGradually: {
            enabled: true,
            delay: 300
          }
        }
      },

      series: data,
      labels: stages,

      // 🎨 ألوان متدرجة (فاتح ➜ غامق)
      colors: ['#00E396', '#00C9A7', '#008FFB', '#775DD0'],

      plotOptions: {
        radialBar: {
          hollow: {
            size: '45%'
          },

          track: {
            background: '#eee',
            strokeWidth: '100%',
            margin: 8 // 👈 مسافة بين الطبقات (مهم 🔥)
          },

          dataLabels: {
            name: {
              fontSize: '13px' ,
               show: true,
              fontWeight: 'bold',
            },
            value: {
              fontSize: '13px',
              fontWeight: 'bold',
              formatter: (val: number) => `${val}%`
            },
            total: {
              show: true,
              label: 'Total',
              formatter: () => total.toString()
            }
          }
        }
      },

      // 🔥 الشكل الناعم
      stroke: {
        lineCap: 'round',
        width: 5
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal', // 👈 يخلي اللون يلف مع الدائرة
          shadeIntensity: 0.5,
          gradientToColors: ['#009688', '#007EA7', '#0052CC', '#4B3FCF'],
          opacityFrom: 1,
          opacityTo: 0.6,
          stops: [0, 100]
        }
      },

      legend: {
        show: true,
        position: 'bottom'
      },

      tooltip: {
        y: {
          formatter: (_: number, opts: any) => {
            return `${rawData[opts.seriesIndex]} Visits`;
          }
        }
      }
    };
  }

  followersApex(project: Iproject): ApexOptions {

    const startDate = new Date(project.date_start);
    const results = project?.results ?? [];

    const seriesData = results.map((r, i) => {

      const date = new Date(startDate);
      date.setMonth(date.getMonth() + (i * 3)); // كل مرحلة +3 شهور

      return [
        date.getTime(),
        Number(r.New_follower ?? 0)
      ];
    });

    return {
      series: [{
        name: 'New Followers',
        data: seriesData
      }],

      chart: {
        type: 'area',
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },

      dataLabels: { enabled: false },

      markers: { size: 4 }, // نخليها 4 عشان النقاط تبان

      title: {
        text: 'New Followers Growth Over Time',
        align: 'left'
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0,
          stops: [0, 90, 100]
        }
      },

      stroke: {
        curve: 'smooth',
        width: 3
      },

      xaxis: {
        type: 'datetime'
      },

      yaxis: {
        title: { text: 'Followers' }
      },

      tooltip: {
        y: {
          formatter: (val: number) => `${val} Followers`
        }
      },

      colors: ['#00E396']
    };
  }

}


// allDateApex(project: Iproject): ApexOptions {
//   const series: ApexAxisChartSeries = project.results?.map((r, i) => ({
//     name: i === 0
//       ? 'Before 3 Months'
//       : `After ${i * 3} Months`,
//     data: [
//       Number(r.view || 0),
//       Number(r.interaction || 0),
//       Number(r.Click || 0),
//       Number(r.visit_page || 0),
//       Number(r.New_follower || 0)
//     ]
//   })) || [];

//   return {
//     chart: {
//       type: 'line', // ✅ مهم
//       height: 350,
//       toolbar: { show: true },
//       animations: { enabled: true, easing: 'easeout', speed: 800 }
//     },

//     series,

//     xaxis: {
//       categories: ['Views', 'Interaction', 'Click', 'Visit Page', 'New Followers']
//     },

//     yaxis: {
//       title: { text: 'Count' }
//     },

//     colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],

//     dataLabels: { enabled: true },

//     stroke: {
//       curve: 'smooth', // 🔥 يخليها زي ECG
//       width: 3
//     },

//     markers: {
//       size: 5 // 🔴 النقاط
//     },

//     fill: {
//       type: 'solid',
//       opacity: 0.7
//     },

//     tooltip: {
//       y: {
//         formatter: (val: number) => val.toString()
//       }
//     }
//   };
// }
